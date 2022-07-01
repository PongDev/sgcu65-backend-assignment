import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ErrorMessage } from 'src/dto/error.dto';
import {
  AddOrRemoveTeamUsers,
  Team,
  TeamWithUsersEmail,
} from 'src/dto/team.dto';
import { TeamService } from './team.service';

@ApiTags('Team')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({
  description: 'Permission Denied',
  type: ErrorMessage,
})
@Controller('team')
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Post('create/:team_name')
  @ApiBadRequestResponse({
    description: 'Invalid Team Data Parameter',
    type: ErrorMessage,
  })
  @ApiCreatedResponse({
    description: 'Team Created',
    type: Team,
  })
  @ApiParam({ name: 'team_name', description: 'Create Team Name' })
  @ApiOperation({ description: 'Create Team for Admin' })
  async createTeam(@Request() req, @Param() params): Promise<Team> {
    return await this.teamService.createTeam(req.user, params.team_name);
  }

  @Put(':id/users')
  @ApiNotFoundResponse({
    description: 'Team or Users Not Found',
    type: ErrorMessage,
  })
  @ApiOkResponse({
    description: 'Update Team Data',
  })
  @ApiParam({ name: 'id', description: "Target Team's ID" })
  @ApiOperation({
    description: 'Update Team Data by Admin',
  })
  async addOrRemoveTeamUsers(
    @Request() req,
    @Param() params,
    @Body() payload: AddOrRemoveTeamUsers,
  ): Promise<TeamWithUsersEmail> {
    return await this.teamService.addOrRemoveTeamUsers(
      req.user,
      parseInt(params.id),
      payload.usersEmail,
      payload.isAdd,
    );
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Get Team Data',
  })
  @ApiParam({ name: 'id', description: "Target Team's ID" })
  @ApiOperation({
    description:
      'Get Team By ID (Admin always found team if exists, User only found team that they participate)',
  })
  async getTeamByID(
    @Request() req,
    @Param() params,
  ): Promise<TeamWithUsersEmail> {
    return await this.teamService.getTeamByID(req.user, parseInt(params.id));
  }

  @Get()
  @ApiOkResponse({
    description: 'Get All Teams Data',
  })
  @ApiOperation({
    description:
      'Get Team By ID (Admin always found all exists teams, User only found all teams that they participate)',
  })
  async getAllTeam(@Request() req) {
    return this.teamService.getAllTeam(req.user);
  }

  @Put(':id/:new_name')
  @ApiOkResponse({
    description: 'Update Teams Name',
  })
  @ApiBadRequestResponse({
    description: 'Team Name Already Exists',
    type: ErrorMessage,
  })
  @ApiParam({ name: 'new_name', description: "New Target Team's Name" })
  @ApiParam({ name: 'id', description: "Target Team's ID" })
  async editTeam(@Request() req, @Param() params): Promise<Team> {
    return await this.teamService.editTeam(
      req.user,
      parseInt(params.id),
      params.team_name,
    );
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Delete Teams Data',
  })
  @ApiNotFoundResponse({
    description: 'Target Team Not Found',
    type: ErrorMessage,
  })
  @ApiParam({ name: 'id', description: "Target Team's ID" })
  async deleteTeam(@Request() req, @Param() params): Promise<Team> {
    return await this.teamService.deleteTeam(req.user, parseInt(params.id));
  }
}
