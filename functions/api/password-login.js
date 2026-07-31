import { usersTable } from "../../db/schema";
import { createAuthCookie } from "../utils/cookie";
import { eq } from "drizzle-orm";
import { getDb } from "../../db/drizzle";
import bcrypt from "bcryptjs";
/* this project will actually need the same user on multiple platforms so I need to implement a login system.
WebAuthn is kinda finicky and if a user changes devices or microsoft accounts they'll lose access
Things I need in general:
- DONE - Login Page
- DONE - Account Creation Page
- DONE - Account Management Page (change username, delete account, etc.)
- DONE - Terms and Conditions Page (for legal reasons)
For Backend:
- DONE - Create and manage user accounts
- DONE - Handle login requests and authentication
- DONE - Store user data securely (passwords, preferences, etc.) Hash it one way
- DONE - 2 way hash session management(already have a session management system but it needs to be more secure)
*/
export async function onRequest({ request }) {
  if (request.method !== "POST") {
    return Response.json(
      { success: false, message: "Invalid request method" },
      { status: 405 },
    );
  }
  const body = await request.json();
  const { email, password } = body; // both are unhashed going in
  const db = getDb();
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
  // this is where you hash the password

  // after one way hashing password search in db for that password and username
  // if result return it otherwise return failure
  const userResults = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);
  let userId = userResults[0]?.id; // userId is not the same as password or username, its a my website specific id, so nothing valuable
  if (!userId) {
    return Response.json(
      { success: false, message: "Incorrect Email or Password" },
      { status: 400 },
    );
  }
  // password should only be null in database if email is also null

  if (!(await bcrypt.compare(password, userResults[0]?.password))) {
    return Response.json(
      { success: false, message: "Incorrect Email or Password" },
      { status: 400 },
    );
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
