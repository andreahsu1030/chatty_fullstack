import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Friendship, FriendshipDocument } from './models/friendship.model';
import { Model, Types } from 'mongoose';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectModel(Friendship.name)
    private readonly friendshipModel: Model<FriendshipDocument>,
  ) {}

  public async isExistFriendship(requester: string, recipient: string) {
    const isExist = await this.friendshipModel
      .findOne({
        $or: [
          { requester, recipient },
          { requester: recipient, recipient: requester },
        ],
      })
      .exec();

    return isExist;
  }

  public async findAllFriendships() {
    return this.friendshipModel.find().exec();
  }

  async createFriendships(requester: string, recipient: string) {
    if (requester === recipient)
      throw new BadRequestException('Requester & Recipient cant be same');
    const obj = {
      requester: new Types.ObjectId(requester),
      recipient: new Types.ObjectId(recipient),
    }
    return this.friendshipModel.create(obj);
  }

  async findFriendshipsByQuery(query: object) {
    const result =await  this.friendshipModel.find(query);
    return result
  }

  async updateFriendshipStatus(query: Partial<Friendship>) {
    const { requester, recipient, status } = query;
    const data = await this.friendshipModel.findOneAndUpdate(
      { requester, recipient },
      { status },
      { new: true },
    );
    return data;
  }
}
