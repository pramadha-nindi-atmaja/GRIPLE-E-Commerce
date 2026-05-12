import { v2 as cloudinary } from "cloudinary";

import { auth } from "@/auth";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadToCloudinary(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: "griple/products", resource_type: "image" },
        (err, result) => {
          if (err || !result) return reject(err ?? new Error("Upload failed"));
          resolve(result.secure_url);
        }
      )
      .end(buffer);
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "No file" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return Response.json({ error: "Unsupported image type" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return Response.json({ error: "File too large (max 5 MB)" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await uploadToCloudinary(buffer);

  return Response.json({ url });
}
