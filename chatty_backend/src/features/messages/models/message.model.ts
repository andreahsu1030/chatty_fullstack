import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Chat } from 'src/features/chats/models/chat.model';
import { User } from 'src/features/users/models/user.model';

@Schema({ timestamps: true, versionKey: false })
export class Message {
  @Prop({ type: Types.ObjectId, required: true, ref: Chat.name })
  chatId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  sender: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, default: false })
  read: boolean;
}

export type MessageDocument = Document &
  Message & {
    createdAt: Date;
    updatedAt: Date;
  };
export const MessageSchema = SchemaFactory.createForClass(Message);
