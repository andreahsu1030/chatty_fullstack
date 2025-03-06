import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { FilterQuery } from 'mongoose';
import { Message, MessageDocument } from './models/message.model';
import { UpdateStatusDto } from './dtos/UpdateStatus.dto';
import { createResponse } from 'src/helps/res.helper';
import { timestamp } from 'rxjs';
import { CreateMessageDto } from './dtos/createMessage.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messageService: MessagesService) {}

  @Get()
  getAll() {
    return this.messageService.findAll();
  }

  @Post()
  async createMsg(@Body() dto: CreateMessageDto) {
    if (!dto.chatId || !dto.content || !dto.sender) {
      throw new BadRequestException('Missing properties');
    }
    const msg = await this.messageService.createMsg(dto);
    const data = {
      sender: msg.sender,
      content: msg.content,
      timestamp: msg.createdAt,
    };
    return createResponse('success', data, '');
  }

  @Post('search/:userId')
  async createFriendsChat(){

  }

  @Get('search/:chatId')
  async getMsgByChatId(@Param('chatId') chatId: string) {
    const msg = await this.messageService.findMsgByChatId(chatId);
    if (msg.length === 0) {
      return createResponse('success', [], '');
    }
    const data = msg.map((item) => ({
      sender: item.sender,
      content: item.content,
      read: item.read,
      timestamp: item.createdAt,
    }));
    return createResponse('success', data, '');
  }

  @Post('search')
  async getMsgByQuery(@Body() dto: FilterQuery<MessageDocument>) {
    try {
      const msg = await this.messageService.findMsgByQuery(dto);
      const data = {
        chatId: msg.chatId,
        sender: msg.sender,
        content: msg.content,
        read: msg.read,
      };
      return createResponse('success', data, '');
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException('msg not found');
      }
    }
  }

  @Post('status')
  async updateMsgStatus(@Body() dto: UpdateStatusDto) {
    const { chatId, read } = dto;
    const isExist = await this.messageService.findMsgByQuery({ chatId });
    if (!isExist) {
      throw new NotFoundException('Not found message');
    }
    const msg = await this.messageService.updateStatus(chatId, read);
    return msg;
  }

  @Post('preview')
  async getLatestsMsgByChatIds(@Body() chatIds: string[]) {
    const msg = await this.messageService.findLatestMsgByChatId(chatIds);
    if (!msg) throw new NotFoundException('msg not found');
    const data = msg.map((i) => ({
      chatId: i.chatId,
      content: i.content,
      timestamp: i.createdAt,
    }));
    return createResponse('success', data, '');
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.messageService.removeMsg(id);
  }


}
