import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dtos/createUser.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserPayload } from './decorations/usePayload.decorator';
import { IUserPayload } from './models/payload.model';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/signup')
  async signup(@Body() dto: CreateUserDto) {
    const { username } = dto;
    const isExist = await this.usersService.isExistUser(username);
    if (isExist) {
      const message = 'Username is in used!';
      throw new BadRequestException(message);
    }
    return this.usersService.createUser(dto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('/signin')
  signin(@UserPayload() user: IUserPayload) {
    const token = this.jwtService.sign(user);
    return { access_token: token };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  getCurrentUser(@Req() req: Request) {
    const user = req.user;
    return user;
  }
}
