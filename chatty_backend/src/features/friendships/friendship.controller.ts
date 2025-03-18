import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Patch,
  Post,
} from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { CreateRelationDto } from './dtos/createRelation.dto';
import { FriendshipDocument } from './models/friendship.model';
import { UpdateStatusDto } from './dtos/updateStatus.dto';
import { Types } from 'mongoose';
import { createResponse } from 'src/helps/res.helper';
import { UsersService } from '../users/users.service';

@Controller('friendships')
export class FriendshipController {
  constructor(
    private readonly friendshipService: FriendshipService,
    private readonly usersService: UsersService,
  ) {}

  @Post('check')
  async checkFriendships(@Body() dto: Partial<FriendshipDocument>) {
    const { requester, recipient } = dto;
    const isExist = await this.friendshipService.isExistFriendship(
      String(requester),
      String(recipient),
    );
    return isExist;
  }

  @Get()
  async findAll() {
    return this.friendshipService.findAllFriendships();
  }

  @Post()
  async buildRelation(@Body() dto: CreateRelationDto) {
    const { requester, recipient } = dto;
    return this.friendshipService.createFriendships(requester, recipient);
  }

  @Post('search')
  async getFriendshipsByOptions(
    @Body()
    body: {
      userId?: string;
      requester?: string;
      recipient?: string;
      options: number;
    },
  ) {
    const { userId, options, requester, recipient } = body;
    if (options === 1) {
      if (!userId)
        throw new BadRequestException('Missing required parameter: userId');
      const obj = {
        $or: [
          { requester: new Types.ObjectId(userId) },
          { recipient: new Types.ObjectId(userId) },
        ],
        status: 'accept',
      };
      const result = await this.friendshipService.findFriendshipsByQuery(obj);
      if (!result) throw new NotFoundException('Not Found Data');
      const filteredResult = result
        .map((row) => {
          return [row.requester, row.recipient].filter(
            (item) => String(item) !== userId,
          );
        })
        .flat();
      return createResponse('success', filteredResult, '');
    }
    if (options === 2) {
      if (!userId)
        throw new BadRequestException('Missing required parameter: userId');
      const obj = {
        recipient: new Types.ObjectId(userId),
        status: 'pending',
      };
      const list = await this.friendshipService.findFriendshipsByQuery(obj);
      if (list.length === 0) createResponse('success', '', 'There is no data');
      const filteredArray = list.map((i) => i.requester);
      return createResponse('success', filteredArray, '');
    }

    if (options === 3) {
      if (!requester || !recipient)
        throw new BadRequestException(
          'Missing required parameters: requester or recipient',
        );

      const obj = {
        $and: [
          {
            requester: new Types.ObjectId(requester),
            recipient: new Types.ObjectId(recipient),
          },
        ],
      };
      const result = await this.friendshipService.findFriendshipsByQuery(obj);
      if (!result) return;
      return createResponse('success', result, '');
    }
    return;
  }

  @Patch('status')
  async updateStatus(@Body() dto: UpdateStatusDto) {
    const { requester, recipient, status } = dto;
    const validateStatus = ['accept', 'pending', 'reject'];
    if (!validateStatus.includes(status)) {
      throw new BadRequestException('Invalid status value');
    }
    if (!requester || !recipient)
      throw new BadRequestException('Missing properties requester, recipient');

    //判斷requester recipient 皆是使用者
    const requesterExists = await this.usersService.findUserById({
      _id: requester,
    });
    const recipientExists = await this.usersService.findUserById({
      _id: recipient,
    });
    if (!requesterExists || !recipientExists) {
      throw new NotFoundException(
        'Invalid Users: requester or recipient not found.',
      );
    }

    //判斷是否已建立 friendships
    const data = await this.friendshipService.isExistFriendship(
      requester,
      recipient,
    );

    //如果沒有就創立並且更新狀態
    if (!data) {
      const newData = await this.friendshipService.createFriendships(
        requester,
        recipient,
      );
      const result = await this.friendshipService.updateFriendshipStatus({
        requester: newData?.requester,
        recipient: newData?.recipient,
        status,
      });
      if (!result) return 'Err';
      return createResponse('success', result, '');
    }
    //單純更改狀態
    const result = await this.friendshipService.updateFriendshipStatus({
      requester: data?.requester,
      recipient: data?.recipient,
      status,
    });
    if (!result) return 'Err';
    return createResponse('success', result, '');
  }
}
