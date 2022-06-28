import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthCredential, JWTAccessToken } from 'src/dto/auth.dto';
import { ErrorMessage } from 'src/dto/error.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiCreatedResponse({
    description: 'Return Access Token',
    type: JWTAccessToken,
  })
  @ApiBadRequestResponse({
    description: 'Email and Password is Required',
    type: ErrorMessage,
  })
  @ApiUnauthorizedResponse({
    description: 'Wrong Email or Password',
    type: ErrorMessage,
  })
  @ApiOperation({ description: 'Auth for get Bearer Token' })
  async login(@Body() credential: AuthCredential): Promise<JWTAccessToken> {
    return await this.authService.login(credential.email, credential.password);
  }
}
