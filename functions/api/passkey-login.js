import { eq } from "drizzle-orm";
import { getDb } from "../../db/drizzle";
import { usersTable } from "../../db/schema";
import { createAuthCookie } from "../utils/cookie";

export async function onRequest({ request }) {
  if (request.method !== "POST") {
    return Response.json(
      { success: false, message: "Invalid request method" },
      { status: 405 },
    );
  }

  // based on request.type of login will login in different ways:

  const body = await request.json();
  const { deviceId } = body;
  const db = getDb();

  if (!deviceId) {
    return Response.json(
      { success: false, message: "Missing deviceId" },
      { status: 400 },
    );
  }

  const userResults = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.device_id, deviceId))
    .limit(1);

  let userId = userResults[0]?.id;

  if (!userResults[0]) {
    try {
      userId = (
        await db
          .insert(usersTable)
          .values({
            device_id: deviceId,
          })
          .returning({
            id: usersTable.id,
          })
      )[0].id;
    } catch (error) {
      return Response.json(
        { success: false, message: error.message },
        { status: 500 },
      );
    }
  }
  const cookie = createAuthCookie(userId);
  return Response.json(
    { success: true, message: "Login successful" },
    {
      status: 200,
      headers: {
        "Set-Cookie": `krish-auth=${cookie}; HttpOnly; Secure; Path=/;`, // may hash it in the future
      },
    },
  );
}
