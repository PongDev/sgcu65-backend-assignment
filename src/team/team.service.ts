import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Team, TeamWithUsersEmail } from 'src/dto/team.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JWTData } from 'src/types/jwt';

@Injectable()
export class TeamService {
  constructor(private prismaService: PrismaService) {}

  async createTeam(loginUserJWT: JWTData, teamName: string): Promise<Team> {
    const loginUser = await this.prismaService.user.findUnique({
      where: { email: loginUserJWT.email },
    });

    if (loginUser.role === Role.ADMIN) {
      try {
        return await this.prismaService.team.create({
          data: {
            name: teamName,
          },
        });
      } catch {
        throw new HttpException('Team Name Exists', HttpStatus.BAD_REQUEST);
      }
    }
    throw new HttpException('Permission Denied', HttpStatus.UNAUTHORIZED);
  }

  async addOrRemoveTeamUsers(
    loginUserJWT: JWTData,
    teamID: number,
    usersEmail: string[],
    isAdd: boolean,
  ): Promise<TeamWithUsersEmail> {
    const loginUser = await this.prismaService.user.findUnique({
      where: { email: loginUserJWT.email },
    });

    if (loginUser.role === Role.ADMIN) {
      try {
        const { users, ...teamData } = await this.prismaService.team.update({
          where: {
            id: teamID,
          },
          data: {
            users: isAdd
              ? {
                  connect: usersEmail.map((e) => ({
                    userEmail_teamId: {
                      userEmail: e,
                      teamId: teamID,
                    },
                  })),
                }
              : {
                  disconnect: usersEmail.map((e) => ({
                    userEmail_teamId: {
                      userEmail: e,
                      teamId: teamID,
                    },
                  })),
                },
          },
          include: {
            users: {
              select: {
                userEmail: true,
              },
            },
          },
        });
        return { usersEmail: users.map((e) => e.userEmail), ...teamData };
      } catch {
        throw new HttpException(
          'Team or Users Not Found',
          HttpStatus.NOT_FOUND,
        );
      }
    }
    throw new HttpException('Permission Denied', HttpStatus.UNAUTHORIZED);
  }

  async getTeamByID(
    loginUserJWT: JWTData,
    teamID: number,
  ): Promise<TeamWithUsersEmail> {
    const loginUser = await this.prismaService.user.findUnique({
      where: { email: loginUserJWT.email },
    });

    const teamData = await this.prismaService.team.findFirst({
      where:
        loginUser.role === Role.ADMIN
          ? {
              id: teamID,
            }
          : {
              id: teamID,
              users: {
                some: {
                  userEmail: loginUser.email,
                },
              },
            },
      include: {
        users: {
          select: {
            userEmail: true,
          },
        },
      },
    });
    return {
      id: teamData.id,
      name: teamData.name,
      usersEmail: teamData.users.map((e) => e.userEmail),
    };
  }

  async getAllTeam(loginUserJWT: JWTData): Promise<TeamWithUsersEmail[]> {
    const loginUser = await this.prismaService.user.findUnique({
      where: { email: loginUserJWT.email },
    });

    if (loginUser.role === Role.ADMIN) {
      return (
        await this.prismaService.team.findMany({
          include: {
            users: {
              select: {
                userEmail: true,
              },
            },
          },
        })
      ).map((e) => ({
        id: e.id,
        name: e.name,
        usersEmail: e.users.map((e) => e.userEmail),
      }));
    } else {
      return (
        await this.prismaService.team.findMany({
          where: {
            users: {
              some: {
                userEmail: loginUser.email,
              },
            },
          },
          include: {
            users: {
              select: {
                userEmail: true,
              },
            },
          },
        })
      ).map((e) => ({
        id: e.id,
        name: e.name,
        usersEmail: e.users.map((e) => e.userEmail),
      }));
    }
  }

  async editTeam(
    loginUserJWT: JWTData,
    teamID: number,
    teamName: string,
  ): Promise<Team> {
    const loginUser = await this.prismaService.user.findUnique({
      where: { email: loginUserJWT.email },
    });

    if (loginUser.role === Role.ADMIN) {
      try {
        return await this.prismaService.team.update({
          where: {
            id: teamID,
          },
          data: {
            name: teamName,
          },
        });
      } catch {
        throw new HttpException('Team Name Exists', HttpStatus.BAD_REQUEST);
      }
    }
    throw new HttpException('Permission Denied', HttpStatus.UNAUTHORIZED);
  }

  async deleteTeam(loginUserJWT: JWTData, targetTeam: number): Promise<Team> {
    const loginUser = await this.prismaService.user.findUnique({
      where: { email: loginUserJWT.email },
    });

    if (loginUser.role === Role.ADMIN) {
      try {
        return await this.prismaService.team.delete({
          where: {
            id: targetTeam,
          },
        });
      } catch {
        throw new HttpException('Target Team Not Found', HttpStatus.NOT_FOUND);
      }
    }
    throw new HttpException('Permission Denied', HttpStatus.UNAUTHORIZED);
  }
}
