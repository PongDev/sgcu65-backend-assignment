import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { JWTData } from 'src/types/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { CreateUserData, GetUserData, UpdateUserData } from 'src/dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {}

  async createUser(
    loginUserJWT: JWTData,
    createUserData: CreateUserData,
  ): Promise<GetUserData> {
    const loginUser = await this.prismaService.user.findUnique({
      where: { email: loginUserJWT.email },
    });

    if (loginUser.role === Role.ADMIN) {
      createUserData.password = await bcrypt.hash(
        createUserData.password,
        this.configService.get<number>('bcrypt.cost'),
      );
      try {
        return await this.prismaService.user.create({
          data: createUserData,
          select: { email: true, firstname: true, surname: true, role: true },
        });
      } catch {
        throw new HttpException('User Email Exists', HttpStatus.BAD_REQUEST);
      }
    }
    throw new HttpException('Permission Denied', HttpStatus.UNAUTHORIZED);
  }

  async getUser(
    loginUserJWT: JWTData,
    getUserEmail: string,
  ): Promise<GetUserData> {
    const loginUser = await this.prismaService.user.findUnique({
      where: { email: loginUserJWT.email },
    });

    if (loginUser.role === Role.ADMIN || loginUser.email === getUserEmail) {
      try {
        return await this.prismaService.user.findUnique({
          where: { email: getUserEmail },
          select: { email: true, firstname: true, surname: true, role: true },
        });
      } catch {
        throw new HttpException('User Data Not Found', HttpStatus.NOT_FOUND);
      }
    }
    throw new HttpException('Permission Denied', HttpStatus.UNAUTHORIZED);
  }

  async updateUser(
    loginUserJWT: JWTData,
    updateUserData: UpdateUserData,
  ): Promise<GetUserData> {
    const loginUser = await this.prismaService.user.findUnique({
      where: { email: loginUserJWT.email },
    });

    if (loginUser.role === Role.ADMIN) {
      if (updateUserData.password) {
        updateUserData.password = await bcrypt.hash(
          updateUserData.password,
          this.configService.get<number>('bcrypt.cost'),
        );
      }
      const { email, ...UpdatePath } = updateUserData;
      try {
        return await this.prismaService.user.update({
          where: { email },
          data: UpdatePath,
          select: { email: true, firstname: true, surname: true, role: true },
        });
      } catch {
        throw new HttpException('User Data Not Found', HttpStatus.NOT_FOUND);
      }
    } else if (
      loginUser.email === updateUserData.email &&
      updateUserData.password
    ) {
      updateUserData.password = await bcrypt.hash(
        updateUserData.password,
        this.configService.get<number>('bcrypt.cost'),
      );
      try {
        return await this.prismaService.user.update({
          where: { email: updateUserData.email },
          data: {
            password: updateUserData.password,
          },
          select: { email: true, firstname: true, surname: true, role: true },
        });
      } catch {
        throw new HttpException('User Data Not Found', HttpStatus.NOT_FOUND);
      }
    }
    throw new HttpException('Permission Denied', HttpStatus.UNAUTHORIZED);
  }

  async deleteUser(
    loginUserJWT: JWTData,
    deleteUserEmail: string,
  ): Promise<void> {
    const loginUser = await this.prismaService.user.findUnique({
      where: { email: loginUserJWT.email },
    });

    if (loginUser.role === Role.ADMIN) {
      try {
        await this.prismaService.user.delete({
          where: { email: deleteUserEmail },
        });
        return;
      } catch {
        throw new HttpException('User Data Not Found', HttpStatus.NOT_FOUND);
      }
    }
    throw new HttpException('Permission Denied', HttpStatus.UNAUTHORIZED);
  }

  async searchUser(
    loginUserJWT: JWTData,
    searchFirstname: string,
    searchSurname: string,
    searchRole: string,
  ): Promise<GetUserData[]> {
    const loginUser = await this.prismaService.user.findUnique({
      where: { email: loginUserJWT.email },
    });

    if (loginUser.role === Role.ADMIN) {
      let convertSearchRole: Role = null;

      if (searchRole === Role.ADMIN) convertSearchRole = Role.ADMIN;
      else if (searchRole === Role.USER) convertSearchRole = Role.USER;

      if (convertSearchRole === null)
        throw new HttpException(
          'Invalid User Data Parameter',
          HttpStatus.BAD_REQUEST,
        );
      const searchOption = {};

      if (searchFirstname)
        searchOption['firstname'] = { contains: searchFirstname };
      if (searchSurname) searchOption['surname'] = { contains: searchSurname };
      if (convertSearchRole)
        searchOption['role'] = { equals: convertSearchRole };
      return await this.prismaService.user.findMany({
        where: searchOption,
        select: { email: true, firstname: true, surname: true, role: true },
      });
    }
    throw new HttpException('Permission Denied', HttpStatus.UNAUTHORIZED);
  }
}
