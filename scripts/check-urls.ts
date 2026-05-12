import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
p.productImage.findMany({ select: { url: true } }).then((r) => {
  const cloud = r.filter((x) => x.url.includes("cloudinary"));
  const local = r.filter((x) => x.url.startsWith("/"));
  console.log("Total:", r.length);
  console.log("Cloudinary:", cloud.length);
  console.log("Local (belum migrated):", local.length);
  if (local.length > 0) local.slice(0, 10).forEach((x) => console.log(" LOCAL:", x.url));
}).finally(() => p.$disconnect());
