import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { isEmail } from 'class-validator';

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ required: true, minlength: 5, maxlength: 20 })
  username: string;

  @Prop({ required: true })
  password: string;

}
export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = Document & User;
