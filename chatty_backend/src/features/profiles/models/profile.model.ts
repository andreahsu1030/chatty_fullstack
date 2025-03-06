import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users/models/user.model';
import { Types } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Profile {
  @Prop({ type: Types.ObjectId, ref: User.name })
  owner: Types.ObjectId;

  @Prop({})
  nickname: string;

  @Prop({})
  avatar: string;

  @Prop({maxlength: 40})
  bio: string;

}

export const ProfileSchema = SchemaFactory.createForClass(Profile)
export type ProfileDocument = Document & Profile;