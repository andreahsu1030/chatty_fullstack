import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from './models/chat.model';
import { Model, Types } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
  ) {}

  public async removeChatById(id: string) {
    const res = await this.chatModel.findByIdAndDelete({ _id: id });
    if (!res) {
      throw new NotFoundException('Not Found');
    }
    return { msg: 'success', res };
  }

  public findAll() {
    return this.chatModel.find().exec();
  }

  public async findUserChatList(userId: string) {
    const chatsList = await this.chatModel.find({
      participants: { $in: [userId] },
    });
    const data = chatsList.map((item) => {
      const participant = item.participants.find(id => String(id) !== userId)
      return{
        chatId: item._id,
        participant
      }
      
    });
    return data;
  }

  public async createChat(participants: string[]) {
    const createOne = await this.chatModel.create({ participants });
    return createOne;
  }

  public async findChatByChatId(id: string) {
    const chatroom = await this.chatModel.findById(id).exec();

    if (!chatroom) {
      throw new NotFoundException('Chat not found');
    }

    return chatroom;
  }

  public async findChatByParticipants(participants: string[]) {
    const chatroom = await this.chatModel.findOne({
      participants: { $all: participants, $size: 2 },
    });

    if (!chatroom) return null;
    return chatroom;
  }
}
