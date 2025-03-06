import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";


export class FindUserByUsernameDto {
  @ApiProperty({
    maxLength: 20,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  username: string;

}