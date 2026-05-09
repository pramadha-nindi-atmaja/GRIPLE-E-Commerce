/**
 * Upsert akun admin saja (tidak menghapus produk/kategori).
 * Pakai: pnpm db:seed:admin
 */
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function hash(pw: string) {
  return bcrypt.hashSync(pw, 12);
}

async function main() {
  const admins = [
    {
      email: "admin@griple.com",
      name: "Super Admin",
      password: hash("dev-admin-change-me"),
      role: "SUPER_ADMIN" as const,
    },
    {
      email: "staff@griple.com",
      name: "Staff User",
      password: hash("dev-staff-change-me"),
      role: "STAFF" as const,
    },
  ];

  for (const a of admins) {
    await prisma.adminUser.upsert({
      where: { email: a.email },
      create: a,
      update: { name: a.name, password: a.password, role: a.role },
    });
    console.log(`OK: ${a.email} (${a.role})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
