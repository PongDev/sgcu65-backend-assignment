import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ErrorMessage } from 'src/dto/error.dto';
import { CreateUserData, GetUserData, UpdateUserData } from 'src/dto/user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({
  description: 'Permission Denied',
  type: ErrorMessage,
})
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('create')
  @ApiBadRequestResponse({
    description: 'Invalid User Data Parameter',
    type: ErrorMessage,
  })
  @ApiCreatedResponse({
    description: 'User Created',
    type: CreateUserData,
  })
  @ApiOperation({ description: 'Create User for Admin' })
  async createUser(
    @Request() req,
    @Body() createUserData: CreateUserData,
  ): Promise<GetUserData> {
    return await this.userService.createUser(req.user, createUserData);
  }

  @Put('update')
  @ApiNotFoundResponse({
    description: 'User Not Found',
    type: ErrorMessage,
  })
  @ApiBadRequestResponse({
    description: 'Invalid User Data Parameter',
    type: ErrorMessage,
  })
  @ApiOkResponse({
    description: 'Update User Data',
    type: UpdateUserData,
  })
  @ApiOperation({
    description: "Update User Data by Admin or User's Own Password",
  })
  async updateUser(@Request() req, @Body() updateUserData: UpdateUserData) {
    return await this.userService.updateUser(req.user, updateUserData);
  }

  @Delete(':email')
  @ApiNotFoundResponse({
    description: 'User Not Found',
    type: ErrorMessage,
  })
  @ApiOkResponse({
    description: 'Delete User',
  })
  @ApiParam({ name: 'email', description: "Target User's Email" })
  @ApiOperation({
    description: 'Delete User by Admin',
  })
  async deleteUser(@Request() req, @Param() params): Promise<void> {
    return await this.userService.deleteUser(req.user, params.email);
  }

  @Get('search')
  @ApiBadRequestResponse({
    description: 'Invalid User Data Parameter',
    type: ErrorMessage,
  })
  @ApiOkResponse({
    description: 'Search Users',
  })
  @ApiOperation({
    description: 'Search Users by Admin',
  })
  @ApiQuery({ name: 'role', type: 'string', required: false })
  @ApiQuery({ name: 'surname', type: 'string', required: false })
  @ApiQuery({ name: 'firstname', type: 'string', required: false })
  async searchUser(
    @Request() req,
    @Query('firstname') firstname,
    @Query('surname') surname,
    @Query('role') role,
  ): Promise<GetUserData[]> {
    return await this.userService.searchUser(
      req.user,
      firstname,
      surname,
      role,
    );
  }

  @Get(':email')
  @ApiNotFoundResponse({
    description: 'User Not Found',
    type: ErrorMessage,
  })
  @ApiOkResponse({
    description: 'Get User Data',
    type: GetUserData,
  })
  @ApiParam({ name: 'email', description: "Target User's Email" })
  @ApiOperation({ description: "Get User Data for Admin or User's Own Data" })
  async getUser(@Request() req, @Param() params): Promise<GetUserData> {
    return await this.userService.getUser(req.user, params.email);
  }
}
