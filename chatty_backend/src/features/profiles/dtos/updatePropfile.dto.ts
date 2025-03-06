import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({required: true})
  id: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  bio: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  nickname: string;
}
