import { eq } from "drizzle-orm";
import { getDb } from "../../db/drizzle.js";
import { usersTable } from "../../db/schema.js";
import { getUserFromCookie } from "../utils/cookie.js";
import { filterUsername } from "../utils/filter.js";
export async function onRequest({ request }) {
  if (request.method !== "POST") {
    return Response.json(
      { success: false, message: "Invalid request method" },
      { status: 400 },
    );
  }
  const body = await request.json();
  const { newUsername } = body;
  const { filteredUsername, filtered } = filterUsername(newUsername);
  const db = getDb();
  let user = "";
  try {
    user = await getUserFromCookie(request);
  } catch (e) {
    return Response.json(
      { success: false, message: e.message },
      { status: 500 },
    );
  }
  if (!user || !newUsername) {
    return Response.json(
      { success: false, message: "Missing required fields" },
      { status: 400 },
    );
  }
  if (newUsername.toLowerCase() === "krish544") {
    return Response.json(
      { success: false, message: "Yeah no, that's mine" },
      { status: 400 },
    );
  }
  try {
    await db
      .update(usersTable)
      .set({ username: filteredUsername })
      .where(eq(usersTable.id, user.id));
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
  return Response.json(
    {
      success: true,
      message: "Username changed successfully",
      filtered: filtered,
    },
    { status: 200 },
  );
}
