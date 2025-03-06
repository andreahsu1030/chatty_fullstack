import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsMongoId({ message: 'Invalid ID' })
  @IsNotEmpty()
  @ApiProperty({ required: true })
  chatId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  content: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  sender: string;
}
