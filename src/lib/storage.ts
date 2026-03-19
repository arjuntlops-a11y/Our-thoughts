import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { del, put } from "@vercel/blob";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const allowed = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp"]);

export function extForUpload(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  return allowed.has(ext) ? ext : null;
}

function mimeForExt(ext: string) {
  const map: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
  };
  return map[ext] ?? "application/octet-stream";
}

function blobStorageEnabled() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function savePhoto(buffer: Buffer, ext: string) {
  if (blobStorageEnabled()) {
    const pathname = `photos/${randomUUID()}${ext}`;
    const blob = await put(pathname, buffer, {
      access: "public",
      contentType: mimeForExt(ext),
    });
    return { url: blob.url };
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const localName = `${randomUUID()}${ext}`;
  await writeFile(path.join(UPLOAD_DIR, localName), buffer);
  return { url: `/uploads/${localName}` };
}

export async function deletePhoto(url: string) {
  if (url.startsWith("http")) {
    await del(url);
    return;
  }
  const base = path.basename(url);
  try {
    await unlink(path.join(UPLOAD_DIR, base));
  } catch {
    /* ignore */
  }
}
