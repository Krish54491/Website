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

  const body = await request.json();
  const { password, deviceId } = body;

  if (user.password && !password) {
    return Response.json(
      { success: false, message: "Password required to delete account" },
      { status: 400 },
    );
  }
  if (user.device_id && !deviceId) {
    return Response.json(
      { success: false, message: "Passkey required to delete account" },
      { status: 400 },
    );
  }

  if (user.password) {
    if (!(await bcrypt.compare(password, user.password))) {
      return Response.json(
        { success: false, message: "Incorrect password" },
        { status: 400 },
      );
    }
  }
  if (user.device_id) {
    if (deviceId !== user.device_id) {
      return Response.json(
        { success: false, message: "Passkey does not match account" },
        { status: 403 },
      );
    }
  }

  const db = getDb();
  try {
    await db.delete(usersTable).where(eq(usersTable.id, user.id));
  } catch (e) {
    return Response.json(
      { success: false, message: e.message },
      { status: 500 },
    );
  }

  return Response.json(
    { success: true, message: "Account deleted" },
    {
      status: 200,
      headers: {
        "Set-Cookie": "krish-auth=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0",
      },
    },
  );
}
