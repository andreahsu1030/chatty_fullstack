import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Friendship, FriendshipSchema } from './models/friendship.model';
import { FriendshipService } from './friendship.service';
import { FriendshipController } from './friendship.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{
    name: Friendship.name, schema: FriendshipSchema
  }]), UsersModule],
  providers:[FriendshipService, ],
  controllers: [FriendshipController]
})
export class FriendshipModule {}
