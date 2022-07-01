import { ApiProperty } from '@nestjs/swagger';

export class TaskWithoutID {
  @ApiProperty({ example: 'Task 001' })
  name: string;

  @ApiProperty({ example: 'Super Secret Task' })
  content: string;

  @ApiProperty({ description: 'Typescript Date Format' })
  deadline: Date;
}

export class Task {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Task 001' })
  name: string;

  @ApiProperty({ example: 'Super Secret Task' })
  content: string;

  @ApiProperty({ description: 'Typescript Date Format' })
  deadline: Date;
}

export class TaskWithTeams {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Task 001' })
  name: string;

  @ApiProperty({ example: 'Super Secret Task' })
  content: string;

  @ApiProperty({ description: 'Typescript Date Format' })
  deadline: Date;

  @ApiProperty({ example: [1, 2, 3, 4, 5] })
  responsibleTeamsID: number[];
}

export class AddOrRemoveTaskResponsibleTeams {
  @ApiProperty({ example: [1, 2, 3], description: 'Responsible Teams ID' })
  responsibleTeams: number[];

  @ApiProperty({
    example: true,
    description: 'If true will add teams to task else remove from task',
  })
  isAdd: boolean;
}
