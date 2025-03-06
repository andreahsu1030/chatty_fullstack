import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from './models/profile.model';
import { Model, Types } from 'mongoose';
import { UsersService } from 'src/features/users/users.service';
import { ObjectId } from 'mongodb';
import { createResponse } from 'src/helps/res.helper';
import { UpdateProfileDto } from './dtos/updatePropfile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
    private readonly usersService: UsersService,
  ) {}

  async findAllProfile() {
    return this.profileModel.find().exec();
  }

  deleteProfile(id) {
    return this.profileModel.findByIdAndDelete(id).exec();
  }

  async createProfile(obj: UpdateProfileDto) {
    const profile = await this.profileModel.create({
      owner: obj.id,
      nickname: obj.nickname,
      bio: obj.bio,
      avatar: '',
    });
    const data = {
      owner: profile.owner,
      nickname: profile.nickname,
      bio: profile.bio,
      avatar: profile.avatar,
    };
    return data;
  }

  async findProfileById(id: string) {
    const profile = await this.profileModel.findOne({ owner: id }).exec();
    if (profile) {
      // throw new NotFoundException('Profile not found');
      const data = {
        owner: profile.owner,
        nickname: profile.nickname,
        bio: profile.bio,
        avatar: profile.avatar,
      };
      return data;
    }
  }

  async updateProfile(dto: UpdateProfileDto) {
    const profile = await this.profileModel
      .findOneAndUpdate(
        { owner: dto.id },
        { bio: dto.bio, nickname: dto.nickname },
        { new: true },
      )
      .exec();

    const data = {
      owner: profile!.owner,
      nickname: profile!.nickname,
      bio: profile!.bio || '',
      avatar: profile!.avatar || '',
    };
    return data;
  }

  public async findUsersProfile(users: string[]) {
    const res = await this.profileModel.find({ owner: { $in: users } });
    const data = res.map((item) => ({
      owner: item.owner,
      nickname: item.nickname,
      bio: item.bio || '',
      avatar: item.avatar || '',
    }));
    return data;
  }

  public async uploadAvatar(userId: string, fileUrl: string) {
    const checkUser = await this.usersService.findUserById({ _id: userId });
    if (!checkUser) throw new NotFoundException('User Not Found');
    const updateUser = await this.profileModel
      .findOneAndUpdate({ owner: userId }, { avatar: fileUrl }, { new: true })
      .exec();
    if (!updateUser) {
      throw new BadRequestException('Upload fail');
    }
    const data = { id: userId, fileUrl: updateUser?.avatar };
    return data;
  }
}
