import { ApiProperty } from '@nestjs/swagger';

export class ErrorMessage {
  @ApiProperty({ example: 999 })
  statusCode: number;

  @ApiProperty({ example: 'Error Message' })
  message: string;
}
