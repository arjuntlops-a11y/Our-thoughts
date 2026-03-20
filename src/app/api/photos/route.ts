import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { extForUpload, savePhoto } from "@/lib/storage";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const photos = await prisma.photo.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ photos });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  const caption = (form.get("caption") as string | null)?.trim() || null;

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Please choose a photo." }, { status: 400 });
  }

  const ext = extForUpload(file.name);
  if (!ext) {
    return NextResponse.json({ error: "Use JPG, PNG, GIF, or WebP." }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Keep photos under 8MB for snuggly loading times." }, { status: 400 });
  }

  let url: string;
  try {
    ({ url } = await savePhoto(buf, ext));
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not save photo.";
    console.error("[photos POST]", e);
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const photo = await prisma.photo.create({
    data: {
      url,
      caption,
      author: session.name,
    },
  });

  return NextResponse.json({ photo });
}
