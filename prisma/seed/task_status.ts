import { PrismaClient } from '@prisma/client';

const TaskStatus = async (prisma: PrismaClient) => {
  await prisma.taskStatus.createMany({
    data: ['Todo', 'In Progress', 'Done'].map((e) => {
      return { name: e };
    }),
  });
};

export default TaskStatus;
