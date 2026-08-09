import { usersTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import { getDb } from "../../db/drizzle";
import bcrypt from "bcryptjs";
import { getUserFromCookie } from "../utils/cookie";
import { validEmail } from "../utils/checker";

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
      { success: false, message: "Not logged in" },
      { status: 400 },
    );
  }

  // Rate limit: 60-second cooldown
  if (user.last_update) {
    const timeSinceLastUpdate = Date.now() - new Date(user.last_update).getTime();
    if (timeSinceLastUpdate < COOLDOWN_MS) {
      return Response.json(
        { success: false, message: "Please wait before adding password again" },
        { status: 429 },
      );
    }
  }

  const body = await request.json();
  const { deviceId, email, password } = body;

  if (!deviceId) {
    return Response.json(
      { success: false, message: "Missing deviceId" },
      { status: 400 },
    );
  }
  if (deviceId !== user.device_id) {
    return Response.json(
      { success: false, message: "Passkey does not match account" },
      { status: 403 },
    );
  }
  if (!email) {
    return Response.json(
      { success: false, message: "Missing email" },
      { status: 400 },
    );
  }
  if (!validEmail(email)) {
    return Response.json(
      { success: false, message: "Invalid email format" },
      { status: 400 },
    );
  }
  if (!password) {
    return Response.json(
      { success: false, message: "Missing password" },
      { status: 400 },
    );
  }
  if (password.length < 8) {
    return Response.json(
      { success: false, message: "Password must be at least 8 characters" },
      { status: 400 },
    );
  }

  const db = getDb();

  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (existing[0] && existing[0].id !== user.id) {
    return Response.json(
      { success: false, message: "Email already registered" },
      { status: 409 },
    );
  }

  const hash = await bcrypt.hash(password, 10);

  try {
    await db
      .update(usersTable)
      .set({ email, password: hash })
      .where(eq(usersTable.id, user.id));
  } catch (e) {
    return Response.json(
      { success: false, message: e.message },
      { status: 500 },
    );
  }

  return Response.json(
    { success: true, message: "Password added successfully" },
    { status: 200 },
  );
}
