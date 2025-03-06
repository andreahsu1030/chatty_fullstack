import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './models/profile.model';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [MulterModule.register({
    dest: "./upload"
  }),MongooseModule.forFeature([{
    name: Profile.name, schema:ProfileSchema
  }]),UsersModule],
  providers: [ProfileService],
  controllers: [ProfileController]
})
export class ProfileModule {}
