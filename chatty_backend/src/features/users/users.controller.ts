import { Body, Controller, Delete, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { Types } from 'mongoose';
import { FindUserByUsernameDto } from './dtos/findUserByUsername.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: '獲取所有用戶', description: '返回用戶列表' })
  getAllUsers() {
    return this.usersService.findAllUsers();
  }

  @Post('search')
  @ApiOperation({ summary: '用 username 找id', description: '返回 id, username' })
  public async getUserByUsername(@Body() username: FindUserByUsernameDto) {
    const user = await this.usersService.findUserByUsername(username);
    if (!user) throw new NotFoundException('Not Found User');
    const data = {
      id: user._id,
      username: user.username
    }
    return data
  }

  @Delete(':id')
  @ApiOperation({ summary: '刪除用戶', description: '根據 `id` 刪除對應的用戶' })
  delUserById(@Param('id') id: string) {
    return this.usersService.removeUserById(id);
  }
}
