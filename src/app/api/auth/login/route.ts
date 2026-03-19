import { NextResponse } from "next/server";
import {
  checkCouplePassword,
  COUPLE_NAMES,
  createSessionToken,
  type CoupleName,
} from "@/lib/session";
import { SESSION_COOKIE_NAME } from "@/lib/auth-server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const name = body?.name as string | undefined;
  const password = body?.password as string | undefined;

  if (!name || !password || !COUPLE_NAMES.includes(name as CoupleName)) {
    return NextResponse.json({ error: "Pick your name and enter the shared secret." }, { status: 400 });
  }

  if (!checkCouplePassword(password)) {
    return NextResponse.json({ error: "That secret doesn’t match. Try again, lovebirds." }, { status: 401 });
  }

  const token = await createSessionToken(name as CoupleName);
  const res = NextResponse.json({ ok: true, name });
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
