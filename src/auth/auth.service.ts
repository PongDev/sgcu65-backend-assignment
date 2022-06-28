import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JWTAccessToken } from 'src/dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async login(email: string, password: string): Promise<JWTAccessToken> {
    if (!email || !password)
      throw new HttpException(
        'Email and Password is Required',
        HttpStatus.BAD_REQUEST,
      );

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const result = await bcrypt.compare(password, user.password);

    if (result === true) {
      const payload = { sub: email };

      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }
}
