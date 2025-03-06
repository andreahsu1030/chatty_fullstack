import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateRelationDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  requester: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  recipient: string;
}
