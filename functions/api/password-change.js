import { usersTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import { getDb } from "../../db/drizzle";
import bcrypt from "bcryptjs";
import { getUserFromCookie } from "../utils/cookie";

const COOLDOWN_MS = 60000; // 60 seconds

export async function onRequest({ request }) {
  if (request.method !== "POST") {
    return Response.json(
      { success: false, message: "Invalid request method" },
      { status: 405 },
    );
  }
  let user;
  try {
    user = await getUserFromCookie(request);
  } catch (e) {
    return Response.json(
      { success: false, message: e.message },
      { status: 400 },
    );
  }
  if (!user) {
    return Response.json(
      { success: false, message: "Not Logged in" },
      { status: 400 },
    );
  }

  // Rate limit: 60-second cooldown
  if (user.last_update) {
    const timeSinceLastUpdate = Date.now() - new Date(user.last_update).getTime();
    if (timeSinceLastUpdate < COOLDOWN_MS) {
      return Response.json(
        { success: false, message: "Please wait before changing password again" },
        { status: 429 },
      );
    }
  }

  const body = await request.json();
  const { password, newPassword } = body;
  const db = getDb();
  if (!newPassword) {
    return Response.json(
      { success: false, message: "Missing new password" },
      { status: 400 },
    );
  }
  if (newPassword.length < 8) {
    return Response.json(
      { success: false, message: "Password must be at least 8 characters" },
      { status: 400 },
    );
  }
  if (!password) {
    return Response.json(
      { success: false, message: "Missing password" },
      { status: 400 },
    );
  }
  if (!(await bcrypt.compare(password, user.password))) {
    return Response.json(
      { success: false, message: "Incorrect password" },
      { status: 400 },
    );
  }
  const hash = await bcrypt.hash(newPassword, 10);
  try {
    await db
      .update(usersTable)
      .set({ password: hash })
      .where(eq(usersTable.id, user.id));
  } catch (e) {
    return Response.json(
      { success: false, message: e.message },
      { status: 500 },
    );
  }
  return Response.json(
    { success: true, message: "Password changed successfully" },
    { status: 200 },
  );
}
