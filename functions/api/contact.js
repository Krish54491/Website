import { validEmail } from "../utils/checker";
import { Resend } from "resend";
import { CONTACT_INFO } from "../utils/constants";

export async function onRequest({ request }) {
  if (request.method !== "POST") {
    return Response.json(
      { success: false, message: "Invalid request method" },
      { status: 405 },
    );
  }
  const body = await request.json();
  const { email, name, content } = body;
  if (!email || !name || !content) {
    return Response.json(
      { success: false, message: "Missing email, name or content" },
      { status: 400 },
    );
  }
  if (!validEmail(email)) {
    return Response.json(
      { success: false, message: "Not a valid email" },
      { status: 400 },
    );
  }
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: CONTACT_INFO,
    replyTo: email,
    subject: `Contacting from krish544.com: ${name}`,
    text: `From: ${name} <${email}>\n\n${content}`,
  });
  if (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }

  return Response.json(
    { success: true, message: "Message sent successfully" },
    { status: 200 },
  );
}
