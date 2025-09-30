import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class SubscriptionPlanDocument extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  maxProfiles: number;

  // Se añaden para que TypeScript los reconozca
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const SubscriptionPlanSchema = SchemaFactory.createForClass(SubscriptionPlanDocument);

SubscriptionPlanSchema.index({ name: 1 });
SubscriptionPlanSchema.index({ price: 1 });