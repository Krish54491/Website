import { parse } from "cookie";
import { getDb } from "../../db/drizzle.js";
import { usersTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

function sign(value) {
  const SECRET = process.env.COOKIE_SECRET;
  return crypto.createHmac("sha256", SECRET).update(value).digest("base64url");
}

export function createAuthCookie(userId) {
  return `${userId}.${sign(userId)}`;
}

export function verifyAuthCookie(cookie) {
  const parts = cookie.split(".");

  if (parts.length !== 2) {
    return null;
  }

  const [userId, signature] = parts;

  const expected = sign(userId);
  if (signature.length !== expected.length) {
    return null;
  }

  const valid = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected),
  );

  return valid ? userId : null;
}

export function getAuthCookie(request) {
  const cookies = parse(request.headers.get("Cookie") || "");

  const authCookie = cookies["krish-auth"];
  if (!authCookie) {
    throw new Error("No auth cookie found");
  }
  return authCookie;
}

export async function getUserFromCookie(request) {
  const authCookie = getAuthCookie(request);
  const userId = verifyAuthCookie(authCookie);
  if (!userId) {
    throw new Error("Invalid auth cookie");
  }

  const userResults = await getDb()
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);
  if (!userResults[0]) {
    throw new Error("User not found");
  }
  return userResults[0];
}
