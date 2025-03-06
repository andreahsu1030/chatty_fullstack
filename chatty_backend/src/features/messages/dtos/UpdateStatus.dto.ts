import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';


export class UpdateStatusDto {
  @IsMongoId({ message: "Invalid ID" })
  @IsNotEmpty()
  @ApiProperty({required: true})
  chatId: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({required: true})
  read: boolean;
}
