import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Role, Task } from '@prisma/client';
import e from 'express';
import { TaskWithoutID, TaskWithTeams } from 'src/dto/task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JWTData } from 'src/types/jwt';

@Injectable()
export class TaskService {
  constructor(private prismaService: PrismaService) {}

  async createTask(
    loginUserJWT: JWTData,
    createTask: TaskWithoutID,
  ): Promise<Task> {
    const loginUser = await this.prismaService.user.findUnique({
      where: { email: loginUserJWT.email },
    });

    if (loginUser.role === Role.ADMIN) {
      try {
        return await this.prismaService.task.create({
          data: {
            name: createTask.name,
            content: createTask.content,
            deadline: createTask.deadline,
          },
        });
      } catch {
        throw new HttpException(
          'Invalid Create Task Data [Task Name Exists or Invalid Date Format]',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    throw new HttpException('Permission Denied', HttpStatus.UNAUTHORIZED);
  }

  async addOrRemoveTaskResponsibleTeams(
    loginUserJWT: JWTData,
    targetTask: number,
    responsibleTeams: number[],
    isAdd: boolean,
  ): Promise<TaskWithTeams> {
    const loginUser = await this.prismaService.user.findUnique({
      where: { email: loginUserJWT.email },
    });

    if (loginUser.role === Role.ADMIN) {
      try {
        const { teams, ...taskData } = await this.prismaService.task.update({
          where: { id: targetTask },
          data: {
            teams: isAdd
              ? {
                  connect: responsibleTeams.map((e) => ({
                    taskId_teamId: {
                      taskId: targetTask,
                      teamId: e,
                    },
                  })),
                }
              : {
                  disconnect: responsibleTeams.map((e) => ({
                    taskId_teamId: {
                      taskId: targetTask,
                      teamId: e,
                    },
                  })),
                },
          },
          include: {
            teams: {
              select: {
                teamId: true,
              },
            },
          },
        });
        return { responsibleTeamsID: teams.map((e) => e.teamId), ...taskData };
      } catch {
        throw new HttpException(
          'Task or Teams Not Found',
          HttpStatus.NOT_FOUND,
        );
      }
    }
    throw new HttpException('Permission Denied', HttpStatus.UNAUTHORIZED);
  }

  async getTaskByID(
    loginUserJWT: JWTData,
    taskID: number,
  ): Promise<TaskWithTeams> {
    const loginUser = await this.prismaService.user.findUnique({
      where: { email: loginUserJWT.email },
    });

    const taskData = await this.prismaService.task.findFirst({
      where:
        loginUser.role === Role.ADMIN
          ? { id: taskID }
          : {
              id: taskID,
              teams: {
                some: {
                  Team: {
                    users: {
                      some: {
                        userEmail: loginUserJWT.email,
                      },
                    },
                  },
                },
              },
            },
      include: {
        teams: {
          select: {
            teamId: true,
          },
        },
      },
    });
    return {
      id: taskData.id,
      name: taskData.name,
      content: taskData.content,
      deadline: taskData.deadline,
      responsibleTeamsID: taskData.teams.map((e) => e.teamId),
    };
  }

  async getAllTask(loginUserJWT: JWTData): Promise<TaskWithTeams[]> {
    const loginUser = await this.prismaService.user.findUnique({
      where: { email: loginUserJWT.email },
    });

    if (loginUser.role === Role.ADMIN) {
      return (
        await this.prismaService.task.findMany({
          include: {
            teams: {
              select: {
                teamId: true,
              },
            },
          },
        })
      ).map((e) => ({
        id: e.id,
        name: e.name,
        content: e.content,
        deadline: e.deadline,
        responsibleTeamsID: e.teams.map((e) => e.teamId),
      }));
    } else {
      return (
        await this.prismaService.task.findMany({
          where: {
            teams: {
              some: {
                Team: {
                  users: {
                    some: {
                      userEmail: loginUserJWT.email,
                    },
                  },
                },
              },
            },
          },
          include: {
            teams: {
              select: {
                teamId: true,
              },
            },
          },
        })
      ).map((e) => ({
        id: e.id,
        name: e.name,
        content: e.content,
        deadline: e.deadline,
        responsibleTeamsID: e.teams.map((e) => e.teamId),
      }));
    }
  }

  async updateTask(
    loginUserJWT: JWTData,
    targetTask: number,
    updateTaskData: TaskWithoutID,
  ): Promise<Task> {
    const loginUser = await this.prismaService.user.findUnique({
      where: { email: loginUserJWT.email },
    });

    if (loginUser.role === Role.ADMIN) {
      try {
        return await this.prismaService.task.update({
          where: {
            id: targetTask,
          },
          data: {
            name: updateTaskData.name,
            content: updateTaskData.content,
            deadline: updateTaskData.deadline,
          },
        });
      } catch {
        throw new HttpException(
          'Invalid Create Task Data [Task Name Exists or Invalid Date Format]',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    throw new HttpException('Permission Denied', HttpStatus.UNAUTHORIZED);
  }

  async deleteTask(loginUserJWT: JWTData, targetTask: number): Promise<void> {
    const loginUser = await this.prismaService.user.findUnique({
      where: { email: loginUserJWT.email },
    });

    if (loginUser.role === Role.ADMIN) {
      try {
        await this.prismaService.task.delete({
          where: {
            id: targetTask,
          },
        });
        return;
      } catch {
        throw new HttpException('Target Task Not Found', HttpStatus.NOT_FOUND);
      }
    }
    throw new HttpException('Permission Denied', HttpStatus.UNAUTHORIZED);
  }
}
