import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class SubscriptionDocument extends Document {
  // Aseguramos que userId acepte UUIDs (Strings)
  @Prop({ required: true, index: true, type: String })
  userId: string;

  @Prop({ required: true, index: true, type: String })
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
  
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const SubscriptionSchema = SchemaFactory.createForClass(SubscriptionDocument);

SubscriptionSchema.index({ userId: 1, status: 1 });