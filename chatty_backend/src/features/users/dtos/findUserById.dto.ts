import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty } from "class-validator";

export class FindUserByIdDto {
@IsMongoId()
@IsNotEmpty()
@ApiProperty({required: true})
  _id: string
}