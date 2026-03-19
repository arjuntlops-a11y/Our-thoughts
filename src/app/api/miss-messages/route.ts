import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth-server";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const messages = await prisma.missMessage.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ messages });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const text = (body?.text as string | undefined)?.trim();
  if (!text) {
    return NextResponse.json({ error: "Write a tiny note for next time." }, { status: 400 });
  }

  const message = await prisma.missMessage.create({
    data: { text, author: session.name },
  });
  return NextResponse.json({ message });
}
