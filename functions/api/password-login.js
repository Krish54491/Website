import { usersTable } from "../../db/schema";

/* this project will actually need the same user on multiple platforms so I need to implement a login system.
WebAuthn is kinda finicky and if a user changes devices or microsoft accounts they'll lose access
Things I need in general:
- Login Page
- Account Creation Page
- Account Management Page (change username, delete account, etc.)
- Terms and Conditions Page (for legal reasons)
For Backend:
- Create and manage user accounts
- Handle login requests and authentication
- Store user data securely (passwords, preferences, etc.) Hash it one way
- 2 way hash session management(already have a session management system but it needs to be more secure)
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
    .where(and(eq(usersTable.email, email), eq(usersTable.password, password)))
    .limit(1);

  let userId = userResults[0]?.id; // userId is not the same as password or username, its a my website specific id, so nothing valuable
  if (!userId) {
    return Response.json(
      { success: false, message: "Incorrect Email or Password" },
      { status: 400 },
    );
  }

  return Response.json(
    { success: true, message: "Login successful" },
    {
      status: 200,
      headers: {
        "Set-Cookie": `krish-auth=${userId}; HttpOnly; Path=/;`, // may hash it in the future
      },
    },
  );
}
