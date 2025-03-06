import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CheckParticipantsDto } from './dtos/checkParticipants.dto';
import { Types } from 'mongoose';
import { createResponse } from 'src/helps/res.helper';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatService: ChatsService) {}

  @Get()
  getAll() {
    return this.chatService.findAll();
  }

  @Get(':userId')
  getUsersChatList(@Param('userId') userId: string) {
    return this.chatService.findUserChatList(userId);
  }

  @Post()
  async createChat(@Body() dto: CheckParticipantsDto) {
    // 檢查：兩個使用者是否相同
    const [userI, userII] = dto.participants;
    if (userI === userII)
      throw new BadRequestException('participants cant be the same');
    //檢查：是否已存在chat
    const checkDuplicate = await this.chatService.findChatByParticipants(
      dto.participants,
    );
    if(checkDuplicate){
      return checkDuplicate
    }
    return this.chatService.createChat(dto.participants);
  }

  @Get('search/:id')
  async getChatByChatId(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid Chat ID format');
    }
    const data = await this.chatService.findChatByChatId(id);

    return createResponse('success', data, '')
  }

  @Post('search')
  async getChatByParticipants(@Body() dto: CheckParticipantsDto) {
    const [userI, userII] = dto.participants;
    if (userI === userII)
      throw new BadRequestException('participants cant be the same');

    const hasChat = await this.chatService.findChatByParticipants(
      dto.participants,
    );
    if (!hasChat) {
      const createOne = await this.chatService.createChat(dto.participants);
      let data = {
        participants: createOne.participants,
        chatId: createOne._id,
      };
      return createResponse('success', data, '');
    }
    let data = {
      participants: hasChat.participants,
      chatId: hasChat._id,
    };
    return createResponse('success', data, '');
  }

  @Delete(':id')
  deleteChat(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid Chat ID format');
    }
    return this.chatService.removeChatById(id);
  }
}
