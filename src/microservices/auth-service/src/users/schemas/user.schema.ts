import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  name: string;

  @Prop({ default: 0 })
  points: number;

  @Prop({ default: [] })
  profiles: Array<any>;

  @Prop({ default: [] })
  favorites: Array<string>;

  @Prop({ default: [] })
  watchlist: Array<string>;

  @Prop({ default: [] })
  history: Array<any>;
}

export const UserSchema = SchemaFactory.createForClass(User);
