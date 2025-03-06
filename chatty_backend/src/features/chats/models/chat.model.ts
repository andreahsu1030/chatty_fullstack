import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/features/users/models/user.model';

@Schema({ timestamps: true, versionKey: false })
export class Chat {

  @Prop({ type: [Types.ObjectId], required:true, ref: User.name,})
  participants: Types.ObjectId[];
}

export type ChatDocument = Document & Chat;

export const ChatSchema = SchemaFactory.createForClass(Chat)
