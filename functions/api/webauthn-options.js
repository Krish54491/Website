import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
} from "@simplewebauthn/server";

export async function onRequest({ request }) {
  if (request.method !== "POST") {
    return Response.json(
      { success: false, message: "Invalid request method" },
      { status: 405 },
    );
  }

  const body = await request.json();
  const { action } = body;

  try {
    // Get hostname, convert IP to localhost for development
    let rpID = new URL(request.url).hostname;
    if (rpID === "127.0.0.1") {
      rpID = "localhost";
    }
    if (action === "auth-options") {
      const options = await generateAuthenticationOptions({
        rpID: rpID,
      });
      return Response.json({ options });
    }

    if (action === "register-options") {
      const options = await generateRegistrationOptions({
        rpID: rpID,
        rpName: "Krish's Portfolio",
        userID: new Uint8Array(16),
        userName: `user-${Date.now()}`,
        userDisplayName: "User",
      });
      return Response.json({ options });
    }

    return Response.json(
      { success: false, message: "Unknown action" },
      { status: 400 },
    );
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
