import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';
export class FindProfileById {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  _id: string;
}
