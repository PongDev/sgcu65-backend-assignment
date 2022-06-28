import { PrismaClient, Role } from '@prisma/client';

const UserSeed = async (prisma: PrismaClient) => {
  await prisma.user.upsert({
    where: { email: 'isd.team.sgcu@gmail.com' },
    update: {},
    create: {
      email: 'isd.team.sgcu@gmail.com',
      firstname: 'isd',
      surname: 'sgcu',
      password: '$2b$10$0ElNnKpTGa8EUAPcE138tOUQqWv60CvUMz1kbXpg98zSE9aotndUO', // bcrypt hash of password = "password" with salt = 10
      role: Role.ADMIN,
    },
  });
};

export default UserSeed;
