import { cookies } from "next/headers";
import { verifySessionToken, type CoupleName } from "./session";

const COOKIE = "couple_session";

export async function getSession(): Promise<{ name: CoupleName } | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export { COOKIE as SESSION_COOKIE_NAME };
