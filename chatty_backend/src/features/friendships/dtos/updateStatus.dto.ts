import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateStatusDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  requester: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  recipient: string;

  @ApiProperty({ required: true, enum: ['pending', 'accept', 'reject'] })
  @IsEnum(['pending', 'accept', 'reject'])
  @IsNotEmpty()
  status: 'pending' | 'accept' | 'reject';
}
