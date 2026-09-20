import { getDb } from "../../db/drizzle.js";
import { commentsTable, usersTable } from "../../db/schema.js";
import { getUserFromCookie } from "../utils/cookie.js";
import { eq, and, count, sql } from "drizzle-orm";
import { filterComment } from "../utils/filter.js";
import {
  COMMENT_COOLDOWN_MS,
  MAX_DUPLICATE_COMMENTS,
} from "../utils/constants.js";

/**
 *
 * @param {Request} request
 * @returns
 */
export async function onRequest({ request }) {
  // request should always have action parameter: add, list, delete and a page parameter to identify the page
  // for add action, it should have username and content parameters
  // for delete action, it should have comment id parameter or username and content to identify the comment to delete
  // for list action, it should have page parameter to identify the page and pagination parameters later on
  const searchParams = new URL(request.url).searchParams;
  const action = searchParams.get("action");
  const page = searchParams.get("page");

  if (!action || !page) {
    return Response.json(
      { success: false, message: "Missing action or page parameter" },
      { status: 400 },
    );
  }

  try {
    if (action === "add") {
      // test function curl "http://127.0.0.1:8788/api/Comment?action=add&page=home&username=testuser&content=This is a test comment"
      const user = await getUserFromCookie(request);
      const content = searchParams.get("content");
      if (!user || !content) {
        return Response.json(
          { success: false, message: "Missing username or content" },
          { status: 400 },
        );
      }
      return await addComment(page, user, content);
    } else if (action === "list") {
      // test function curl "http://127.0.0.1:8788/api/Comment?action=list&page=testpage&amount=4"
      const amount = Number(searchParams.get("amount"))
        ? Number(searchParams.get("amount"))
        : 100;
      if (isNaN(amount)) {
        return Response.json(
          { success: false, message: "Invalid amount parameter" },
          { status: 400 },
        );
      }
      return await listComments(page, amount);
    } else if (action === "delete") {
      // test function curl "http://127.0.0.1:8788/api/Comment?action=delete&page=testpage"
      const user = await getUserFromCookie(request);
      const commentId = searchParams.get("id");
      if (!user || !commentId) {
        return Response.json(
          { success: false, message: "Missing username or id or both" },
          { status: 400 },
        );
      }
      return await deleteComment(page, user, commentId);
    } else if (action === "total") {
      // test function curl "http://127.0.0.1:8788/api/Comment?action=total&page=testpage"
      return await getTotalComments(page);
    }
    return Response.json(
      { success: false, message: "Invalid action" },
      { status: 400 },
    );
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500, headers: { loggedIn: "false" } },
    );
  }
}

async function addComment(page, user, content) {
  if (user.banned) {
    return Response.json(
      { success: false, message: "User is banned from commenting" },
      { status: 400 },
    );
  }

  const db = getDb();
  try {
    // Atomic rate limit: 2-second cooldown between comments
    // This UPDATE + RETURNING is atomic - only one concurrent request can win
    const cooldownCheck = await db
      .update(usersTable)
      .set({ last_comment_at: new Date() })
      .where(
        and(
          eq(usersTable.id, user.id),
          sql`(${usersTable.last_comment_at} IS NULL OR EXTRACT(EPOCH FROM (NOW() - ${usersTable.last_comment_at})) * 1000 > ${COMMENT_COOLDOWN_MS})`,
        ),
      )
      .returning({ id: usersTable.id });

    if (cooldownCheck.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Please wait before posting another comment",
        },
        { status: 429 },
      );
    }

    // Rate limit: max duplicate comments
    const duplicateCount = await db
      .select({ count: count() })
      .from(commentsTable)
      .where(
        and(
          eq(commentsTable.user_id, user.id),
          eq(commentsTable.content, content),
        ),
      );

    if (duplicateCount[0].count >= MAX_DUPLICATE_COMMENTS) {
      await db
        .update(usersTable)
        .set({ banned: true })
        .where(eq(usersTable.id, user.id));
      return Response.json(
        {
          success: false,
          message:
            "You've posted the same comment too many times, you are now BANNED",
        },
        { status: 429 },
      );
    }
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }

  const filteredContent = filterComment(content);
  try {
    await db.insert(commentsTable).values({
      page: page,
      user_id: user.id,
      content: filteredContent,
    });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }

  return Response.json(
    { success: true, message: "Comment added successfully" },
    { status: 200 },
  );
}
async function listComments(page, amount) {
  try {
    const comments = await getDb()
      .select({
        id: commentsTable.id,
        page: commentsTable.page,
        content: commentsTable.content,
        created_at: commentsTable.created_at,
        username: usersTable.username,
      })
      .from(commentsTable)
      .where(eq(commentsTable.page, page))
      .leftJoin(usersTable, eq(commentsTable.user_id, usersTable.id))
      .orderBy(commentsTable.created_at, "desc")
      .limit(amount);
    return Response.json({ success: true, comments }, { status: 200 });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
async function deleteComment(page, user, id) {
  // delete comment by id or other identifier
  // has extra parameter to check for which comment to delete
  // comment has to belong to the user in order to be deleted or admin
  // admin perms will be added later
  try {
    const commentToBeDeleted = await getDb()
      .select()
      .from(commentsTable)
      .where(
        and(
          eq(commentsTable.id, id),
          eq(commentsTable.user_id, user.id),
          eq(commentsTable.page, page),
        ),
      );
    if (!commentToBeDeleted || commentToBeDeleted.length === 0) {
      return Response.json(
        { success: false, message: "Comment not found or unauthorized" },
        { status: 400 },
      );
    }
    await getDb()
      .delete(commentsTable)
      .where(
        and(
          eq(commentsTable.id, id),
          eq(commentsTable.user_id, user.id),
          eq(commentsTable.page, page),
        ),
      );
    return Response.json(
      { success: true, message: "Comment deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    //console.error("Error deleting comment:", error); // Debugging log
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
async function getTotalComments(page) {
  try {
    const totalComments = await getDb()
      .select({ count: count() })
      .from(commentsTable)
      .where(eq(commentsTable.page, page));
    return Response.json(
      { success: true, totalComments: totalComments[0].count },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
// comments general structure
//  id: uuid default gen_random_uuid() primary key,
//  page: string (not null)
//  username: string (should never be null)
//  content: string (not null)
//  created_at: timestamp default now()
