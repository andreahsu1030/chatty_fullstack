import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UpdateProfileDto } from './dtos/updatePropfile.dto';
import { ProfileService } from './profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from 'src/features/users/users.service';
import { Types } from 'mongoose';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('profiles')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly usersService: UsersService,
  ) {}

  @Get('all')
  @ApiOperation({ summary: '獲取所有 Profile' })
  getAllProfile() {
    return this.profileService.findAllProfile();
  }

  @Post('create')
  @ApiOperation({ summary: '建立新用戶' })
  async createProfile(@Body() dto: UpdateProfileDto) {
    const isExist = await this.profileService.findProfileById(dto.id);
    if (isExist) {
      throw new BadRequestException('Profile already exist');
    }
    return this.profileService.createProfile(dto);
  }

  @Get('search/:id')
  @ApiOperation({ summary: 'user id(owner)搜尋用戶' })
  async getProfileById(@Param('id') id: string) {
    const user = await this.usersService.findUserById({ _id: id });

    const profile = await this.profileService.findProfileById(String(user._id));
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile
  }

  @Post('search')
  @ApiOperation({ summary: '模糊搜尋用戶' })
  async getProfileByUsername(@Body() body: {params: string}) {
    return this.profileService.findProfileByUsername(body.params);
  }


  @Patch()
  @ApiOperation({ summary: '更新Profile' })
  async updateProfile(@Body() dto: UpdateProfileDto) {
    const { id } = dto;
    const user = await this.usersService.findUserById({ _id: id });

    console.log('1',user)
    return this.profileService.updateProfile(dto);
  }

  @Post('upload')
  @ApiOperation({ summary: '上傳照片' })
  @ApiBody({
    description: '上傳圖片和 userId',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        userId: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Body('userId') userId: string,
  ) {
    const fileUrl = `${process.env.BASE_URL}upload/${file.filename}`;
    return this.profileService.uploadAvatar(userId, fileUrl);
  }

  @Post('batch')
  @ApiOperation({ summary: '找多筆使用者Profile' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        users: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
  })
  findUsers(@Body('users') users: string[]) {
    return this.profileService.findUsersProfile(users);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '刪除用戶',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: '用戶的 MongoDB ObjectId',
  })
  removeProfile(@Param('id') id: string) {
    return this.profileService.deleteProfile(id);
  }
}
