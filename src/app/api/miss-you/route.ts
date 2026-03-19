import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth-server";

const DEFAULT_MESSAGES = [
  "Soumya, the stars are just practice for how you light up my world, Arjun.",
  "Arjun, every song sounds better when I imagine dancing with you, Soumya.",
  "Missing you is my heart’s favorite hobby — signed, your Arjun.",
  "Soumya, if hugs were pixels, I’d send you a 4K one every second.",
  "Arjun, you’re my favorite notification in this noisy universe.",
  "Distance is temporary; our silly little love story is permanent.",
  "Soumya, I’m saving the best memes for you. Always.",
  "Arjun, you’re the cozy plot twist I never saw coming.",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [photos, custom] = await Promise.all([
    prisma.photo.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.missMessage.findMany(),
  ]);

  const photoUrls = photos.map((p) => ({ id: p.id, url: p.url, caption: p.caption }));
  const messages = [...DEFAULT_MESSAGES, ...custom.map((m) => m.text)];

  return NextResponse.json({
    photos: shuffle(photoUrls).slice(0, 12),
    messages: shuffle(messages).slice(0, 8),
  });
}
