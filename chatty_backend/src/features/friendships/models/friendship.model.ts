import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/features/users/models/user.model';

@Schema({ timestamps: true, versionKey: false })
export class Friendship {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  requester: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  recipient: Types.ObjectId;

  @Prop({ type: String, enum: ['pending', 'accept', 'reject'], default: 'pending' })
  status: 'pending' | 'accept' | 'reject';
}

export const FriendshipSchema = SchemaFactory.createForClass(Friendship);
FriendshipSchema.index({ requester: 1, recipient: 1 }, { unique: true });

FriendshipSchema.pre<FriendshipDocument>('save', function (next) {
  const requesterId = new Types.ObjectId(this.requester);
  const recipientId = new Types.ObjectId(this.recipient);
  if (requesterId.equals(recipientId)) {
   
    return next(new Error('Requester and Recipient cannot be the same user'));
  }
  next();
});
export type FriendshipDocument = Document & Friendship;
