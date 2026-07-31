import { usersTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import { getDb } from "../../db/drizzle";
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
  const { deviceId } = body;

  if (!deviceId) {
    return Response.json(
      { success: false, message: "Missing deviceId" },
      { status: 400 },
    );
  }
  if (deviceId === user.device_id) {
    return Response.json(
      { success: false, message: "New passkey is the same as current" },
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
      { success: false, message: "Passkey already registered to another account" },
      { status: 409 },
    );
  }

  try {
    await db
      .update(usersTable)
      .set({ device_id: deviceId })
      .where(eq(usersTable.id, user.id));
  } catch (e) {
    return Response.json(
      { success: false, message: e.message },
      { status: 500 },
    );
  }

  return Response.json(
    { success: true, message: "Passkey changed successfully" },
    { status: 200 },
  );
}
