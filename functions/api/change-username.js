import { eq } from "drizzle-orm";
import { getDb } from "../../db/drizzle.js";
import { usersTable } from "../../db/schema.js";
import { getUserFromCookie } from "../utils/cookie.js";
import { filterUsername } from "../utils/filter.js";

const COOLDOWN_MS = 60000; // 60 seconds

export async function onRequest({ request }) {
  if (request.method !== "POST") {
    return Response.json(
      { success: false, message: "Invalid request method" },
      { status: 400 },
    );
  }
  const body = await request.json();
  const { newUsername } = body;
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

  // Rate limit: 60-second cooldown
  if (user.last_update) {
    const timeSinceLastUpdate = Date.now() - new Date(user.last_update).getTime();
    if (timeSinceLastUpdate < COOLDOWN_MS) {
      return Response.json(
        { success: false, message: "Please wait before changing username again" },
        { status: 429 },
      );
    }
  }

  const { filteredUsername, filtered } = filterUsername(newUsername);
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
