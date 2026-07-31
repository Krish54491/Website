import { usersTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import { getDb } from "../../db/drizzle";
import bcrypt from "bcryptjs";
import { getUserFromCookie } from "../utils/cookie";

export async function onRequest({ request }) {
  if (request.method !== "POST") {
    return Response.json(
      { success: false, message: "Invalid request method" },
      { status: 405 },
    );
  }
  let user;
  try {
    user = getUserFromCookie(request);
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
  const body = await request.json();
  const { email, password, newPassword } = body; // both are unhashed going in
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
  if (!email) {
    return Response.json(
      { success: false, message: "Missing email" },
      { status: 400 },
    );
  }
  if (!password) {
    return Response.json(
      { success: false, message: "Missing password" },
      { status: 400 },
    );
  }
  const userResults = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);
  if (!userResults[0]) {
    return Response.json(
      { success: false, message: "Incorrect Email or Password" },
      { status: 400 },
    );
  }
  if (!(await bcrypt.compare(password, userResults[0]?.password))) {
    return Response.json(
      { success: false, message: "Incorrect Email or Password" },
      { status: 400 },
    );
  }
  const hash = await bcrypt.hash(newPassword, 10);
  try {
    await db
      .update()
      .from(usersTable)
      .set({ password: hash })
      .where(eq(usersTable.email, email))
      .limit(1);
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
