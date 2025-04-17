import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from './models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dtos/createUser.dto';
import * as bcrypt from 'bcrypt';
import { createResponse } from 'src/helps/res.helper';
import { FindUserByUsernameDto } from './dtos/findUserByUsername.dto';
import { FindUserByIdDto } from './dtos/findUserById.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  public async findAllUsers() {
    const user = await this.userModel.find().select('-password').exec();

    return createResponse('success', user, '');
  }

  public async createUser(dto: CreateUserDto) {
    const { username, password } = dto;
    const encrypted = await bcrypt.hash(password, 12);
    const user = await this.userModel.create({
      username,
      password: encrypted,
    });
    const data = {
      id: user._id,
      username: user.username,

    }
    return data
  }

  public async findUserByUsername(username: FindUserByUsernameDto) {
    const user = await this.userModel.findOne(username).exec();
    return user;
  }

  public async findUserById(id: FindUserByIdDto) {
    const user = await this.userModel
      .findOne(id)
      .exec();

    if (!user) {
     return createResponse('success', '1', 'User not found')
    }
    return user
  }

  public async removeUserById(id: string) {
    const user = await this.userModel
      .findByIdAndDelete(id)
      .select('-password')
      .exec();

    if (!user) {
      return createResponse('error', null, 'User Not Found');
    }

    return user;
  }

  public async isExistUser(username: string) {
    const exist = await this.userModel
      .exists({
        username,
      })
      .exec();
    return !!exist;
  }
}
