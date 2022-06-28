import { ApiProperty } from '@nestjs/swagger';

export class AuthCredential {
  @ApiProperty({ example: 'isd.team.sgcu@gmail.com' })
  email: string;

  @ApiProperty({ example: 'password' })
  password: string;
}

export class JWTAccessToken {
  @ApiProperty({ example: '[JWT Access Token String]' })
  access_token: string;
}
