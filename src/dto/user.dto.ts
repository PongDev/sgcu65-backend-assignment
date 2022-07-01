import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsIn } from 'class-validator';

export class GetUserData {
  @ApiProperty({ example: 'isd.team.sgcu@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'isd' })
  firstname: string;

  @ApiProperty({ example: 'team' })
  surname: string;

  @ApiProperty({ enum: Role, example: Role.USER })
  @IsIn([Role.ADMIN, Role.USER])
  role: Role;
}

export class CreateUserData extends GetUserData {
  @ApiProperty({ example: 'password' })
  password: string;
}

export class UpdateUserData {
  @ApiProperty({ example: 'isd.team.sgcu@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'isd' })
  firstname?: string;

  @ApiProperty({ example: 'team' })
  surname?: string;

  @ApiProperty({ example: 'password' })
  password?: string;

  @ApiProperty({ enum: Role, example: Role.USER })
  @IsIn([Role.ADMIN, Role.USER])
  role?: Role;
}
