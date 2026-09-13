import "server-only";
import { cookies } from "next/headers";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_DURATION_SECONDS,
  verifySessionToken,
} from "@/lib/auth";

/** Sets the httpOnly admin session cookie. Call only from a Server Action / Route Handler. */
export async function setSessionCookie(subject: string) {
  const token = await createSessionToken({ sub: subject });
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE_NAME);
}

/** Reads and verifies the current admin session, if any. */
export async function getSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}
