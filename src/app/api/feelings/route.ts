import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth-server";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const feelings = await prisma.feeling.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ feelings });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const content = (body?.content as string | undefined)?.trim();
  if (!content) {
    return NextResponse.json({ error: "Write something from the heart." }, { status: 400 });
  }

  const feeling = await prisma.feeling.create({
    data: { content, author: session.name },
  });
  return NextResponse.json({ feeling });
}
