import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class UserDocument extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop()
  birthDate: Date;
  
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: Number, default: 0 })
  currentPoints: number;
  
  // Se añaden para que TypeScript los reconozca
  @Prop()
  createdAt: Date;
  
  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);