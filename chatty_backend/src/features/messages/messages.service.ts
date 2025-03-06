import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './models/message.model';
import { FilterQuery, Model, Types } from 'mongoose';
import { UpdateStatusDto } from './dtos/UpdateStatus.dto';
import { CreateMessageDto } from './dtos/createMessage.dto';
import { ChatsService } from '../chats/chats.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>
  ) {}

  public async findAll() {
    return this.messageModel.find().exec();
  }

  public async findMsgByQuery(query: FilterQuery<MessageDocument>) {
    const msg = await this.messageModel.findOne(query).exec();
    if (!msg) {
      throw new NotFoundException('Not Found Message');
    }
    return msg;
  }

  public async findMsgByChatId(chatId:string){
    const query = {chatId}
    const msg = await this.messageModel.find(query).exec()
    return msg
  }

  public async createMsg(obj: CreateMessageDto) {
    const msg = await this.messageModel.create(obj);
    return msg;
  }

  public async updateStatus(chatId: string , read: boolean) {
    const msg = await this.messageModel.findOneAndUpdate(
      { chatId },
      { read },
      { new: true },
    );
    return msg
  }

  public removeMsg(id: string){
    return this.messageModel.findByIdAndDelete(id)
  }

  public async findMsgByChatIdAndReadStatus(chatId: string, read: boolean) {
    return this.messageModel.find({ chatId, read }).exec();
  }
  
  
  public async findLatestMsgByChatId(chatIds: string[]){
    const latestMessages = await this.messageModel.aggregate([
      { $match: { chatId: { $in: chatIds } } }, // 只篩選符合的 chatId
      { $sort: { createdAt: -1 } }, // 依 `createdAt` 降序排列（最新的在最上）
      { $group: { _id: "$chatId", latestMessage: { $first: "$$ROOT" } } }, // 每組 chatId 取第一筆（最新的）
      { $replaceRoot: { newRoot: "$latestMessage" } } // 移除 group wrapper，回傳完整訊息資料
    ]);

    return latestMessages;
  }
}
