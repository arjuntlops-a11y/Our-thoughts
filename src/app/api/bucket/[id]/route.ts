import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth-server";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const done = body?.done as boolean | undefined;
  if (typeof done !== "boolean") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const item = await prisma.bucketItem.update({
    where: { id },
    data: { done },
  });
  return NextResponse.json({ item });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  await prisma.bucketItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
