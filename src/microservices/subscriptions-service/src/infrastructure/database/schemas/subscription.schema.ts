import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class SubscriptionDocument extends Document {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true, index: true })
  planId: string;

  @Prop({
    enum: ["active", "expired", "canceled"],
    required: true,
    index: true,
  })
  status: string;
  
  @Prop({ type: Number })
  consecutiveMonthsPaid: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true, index: true })
  endDate: Date;
  
  // Se añaden para que TypeScript los reconozca
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const SubscriptionSchema = SchemaFactory.createForClass(SubscriptionDocument);

SubscriptionSchema.index({ userId: 1, status: 1 });