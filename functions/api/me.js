import { getUserFromCookie } from "../utils/cookie";

export async function onRequest({ request }) {
  if (request.method !== "GET") {
    return Response.json(
      { success: false, message: "Invalid request method" },
      { status: 405 },
    );
  }

  let user;
  try {
    user = await getUserFromCookie(request);
  } catch {
    return Response.json(
      { success: false, message: "Not logged in" },
      { status: 401 },
    );
  }
  if (!user) {
    return Response.json(
      { success: false, message: "Not logged in" },
      { status: 401 },
    );
  }
  return Response.json({
    success: true,
    username: user.username,
    hasPassword: user.password !== null,
    hasPasskey: user.device_id !== null,
  });
}
