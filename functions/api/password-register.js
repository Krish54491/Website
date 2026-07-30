import { usersTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import { getDb } from "../../db/drizzle";
import bcrypt from "bcryptjs";
import { validEmail } from "../utils/checker";
import { createAuthCookie } from "../utils/cookie";

export async function onRequest({ request }) {
  if (request.method !== "POST") {
    return Response.json(
      { success: false, message: "Invalid request method" },
      { status: 405 },
    );
  }

  const body = await request.json();
  const { username, email, password } = body;
  const db = getDb();
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

  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (existing[0]) {
    return Response.json(
      { success: false, message: "Email already registered" },
      { status: 409 },
    );
  }

  const hash = await bcrypt.hash(password, 10);

  const userId = (
    await db
      .insert(usersTable)
      .values({
        username: username || "Anon",
        email: email,
        password: hash,
      })
      .returning({
        id: usersTable.id,
      })
  )[0].id;

  const cookie = createAuthCookie(userId);
  return Response.json(
    { success: true, message: "Account created" },
    {
      status: 201,
      headers: {
        "Set-Cookie": `krish-auth=${cookie}; HttpOnly; Secure; Path=/;`,
      },
    },
  );
}
