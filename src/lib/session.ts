import { SignJWT, jwtVerify } from "jose";

export const COUPLE_NAMES = ["Arjun", "Soumya"] as const;
export type CoupleName = (typeof COUPLE_NAMES)[number];

function getSecret() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET is not set");
  return new TextEncoder().encode(s);
}

export async function createSessionToken(name: CoupleName) {
  return new SignJWT({ name })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .setIssuedAt()
    .sign(getSecret());
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const name = payload.name as string;
    if (name !== "Arjun" && name !== "Soumya") return null;
    return { name: name as CoupleName };
  } catch {
    return null;
  }
}

export function checkCouplePassword(password: string) {
  const expected = process.env.COUPLE_SECRET;
  if (!expected) return false;
  return password === expected;
}
