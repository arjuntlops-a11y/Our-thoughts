import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth-server";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dates = await prisma.specialDate.findMany({ orderBy: { date: "asc" } });
  return NextResponse.json({ dates });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const title = (body?.title as string | undefined)?.trim();
  const dateStr = body?.date as string | undefined;
  const note = (body?.note as string | undefined)?.trim() || null;

  if (!title || !dateStr) {
    return NextResponse.json({ error: "Title and date are required." }, { status: 400 });
  }

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return NextResponse.json({ error: "That date looks odd." }, { status: 400 });
  }

  const row = await prisma.specialDate.create({
    data: {
      title,
      date,
      note,
      author: session.name,
    },
  });
  return NextResponse.json({ date: row });
}
