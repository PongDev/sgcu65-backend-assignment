import { ApiProperty } from '@nestjs/swagger';

export class Team {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'ISD' })
  name: string;
}

export class TeamWithUsersEmail extends Team {
  @ApiProperty({
    example: [
      'isd.team.sgcu1@gmail.com',
      'isd.team.sgcu2@gmail.com',
      'isd.team.sgcu3@gmail.com',
    ],
  })
  usersEmail: string[];
}

export class AddOrRemoveTeamUsers {
  @ApiProperty({
    example: [
      'isd.team.sgcu1@gmail.com',
      'isd.team.sgcu2@gmail.com',
      'isd.team.sgcu3@gmail.com',
    ],
    description: 'Users Email',
  })
  usersEmail: string[];

  @ApiProperty({
    example: true,
    description: 'If true will add users to team else remove from team',
  })
  isAdd: boolean;
}
