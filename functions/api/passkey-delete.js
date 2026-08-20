import { usersTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import { getDb } from "../../db/drizzle";
import { getUserFromCookie } from "../utils/cookie";

import { COOLDOWN_MS } from "../utils/constants.js";

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
    const timeSinceLastUpdate =
      Date.now() - new Date(user.last_update).getTime();
    if (timeSinceLastUpdate < COOLDOWN_MS) {
      return Response.json(
        {
          success: false,
          message: "Please wait before changing passkey again",
        },
        { status: 429 },
      );
    }
  }
  const body = await request.json();
  const { deviceId } = body;

  if (!deviceId) {
    return Response.json(
      { success: false, message: "Missing deviceId" },
      { status: 400 },
    );
  }

  const db = getDb();

  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.device_id, deviceId))
    .limit(1);

  if (existing[0] && existing[0].id !== user.id) {
    return Response.json(
      {
        success: false,
        message: "Incorrect Passkey provided",
      },
      { status: 409 },
    );
  }
  if (!existing[0].password || !existing[0].email) {
    return Response.json(
      {
        success: false,
        message:
          "Can not delete passkey as its the only login method for this account",
      },
      { status: 409 },
    );
  }
  try {
    await db
      .update(usersTable)
      .set({ device_id: null })
      .where(eq(usersTable.id, user.id));
  } catch (e) {
    return Response.json(
      { success: false, message: e.message },
      { status: 500 },
    );
  }

  return Response.json(
    { success: true, message: "Passkey deleted successfully" },
    { status: 200 },
  );
}
