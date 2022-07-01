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
  AddOrRemoveTaskResponsibleTeams,
  Task,
  TaskWithoutID,
  TaskWithTeams,
} from 'src/dto/task.dto';
import { TaskService } from './task.service';

@ApiTags('Task')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({
  description: 'Permission Denied',
  type: ErrorMessage,
})
@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post('create')
  @ApiBadRequestResponse({
    description: 'Invalid Task Data Parameter',
    type: ErrorMessage,
  })
  @ApiCreatedResponse({
    description: 'Task Created',
    type: Task,
  })
  @ApiOperation({ description: 'Create Task for Admin' })
  async createTask(
    @Request() req,
    @Body() taskData: TaskWithoutID,
  ): Promise<Task> {
    return await this.taskService.createTask(req.user, taskData);
  }

  @Put(':id/teams')
  @ApiNotFoundResponse({
    description: 'Task or Teams Not Found',
    type: ErrorMessage,
  })
  @ApiOkResponse({
    description: 'Update Task Data',
  })
  @ApiParam({ name: 'id', description: "Target Task's ID" })
  @ApiOperation({
    description: 'Update Task Data by Admin',
  })
  async addOrRemoveTaskResponsibleTeams(
    @Request() req,
    @Param() params,
    @Body() payload: AddOrRemoveTaskResponsibleTeams,
  ): Promise<TaskWithTeams> {
    return await this.taskService.addOrRemoveTaskResponsibleTeams(
      req.user,
      params.id,
      payload.responsibleTeams,
      payload.isAdd,
    );
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Get Task Data',
  })
  @ApiParam({ name: 'id', description: "Target Task's ID" })
  @ApiOperation({
    description:
      'Get Task By ID (Admin always found task if exists, User only found task that they participate)',
  })
  async getTaskByID(@Request() req, @Param() params): Promise<TaskWithTeams> {
    return await this.taskService.getTaskByID(req.user, params.id);
  }

  @Get()
  @ApiOkResponse({
    description: 'Get All Tasks Data',
  })
  @ApiOperation({
    description:
      'Get Task By ID (Admin always found all exists tasks, User only found all tasks that they participate)',
  })
  async getAllTask(@Request() req) {
    return this.taskService.getAllTask(req.user);
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'Update Tasks Data',
  })
  @ApiBadRequestResponse({
    description: 'Invalid Task Data Parameter',
    type: ErrorMessage,
  })
  @ApiParam({ name: 'id', description: "Target Task's ID" })
  async updateTask(
    @Request() req,
    @Param() params,
    @Body() updateTask: TaskWithoutID,
  ): Promise<Task> {
    return await this.taskService.updateTask(req.user, params.id, updateTask);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Delete Tasks Data',
  })
  @ApiNotFoundResponse({
    description: 'Target Task Not Found',
    type: ErrorMessage,
  })
  @ApiParam({ name: 'id', description: "Target Task's ID" })
  async deleteTask(@Request() req, @Param() params): Promise<Task> {
    return await this.taskService.deleteTask(req.user, params.id);
  }
}
