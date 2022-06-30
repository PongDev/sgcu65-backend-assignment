import { PrismaClient } from '@prisma/client';
import UserSeed from './seed/user';

const prisma = new PrismaClient();

async function main() {
  await UserSeed(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
