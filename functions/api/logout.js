export async function onRequest({ request }) {
  if (request.method !== "POST") {
    return Response.json(
      { success: false, message: "Invalid request method" },
      { status: 405 },
    );
  }

  return Response.json(
    { success: true, message: "Logged out" },
    {
      status: 200,
      headers: {
        "Set-Cookie":
          "krish-auth=; HttpOnly; Secure; Path=/; Max-Age=0",
      },
    },
  );
}
