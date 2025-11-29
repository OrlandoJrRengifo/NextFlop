import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubscriptionDocument = Subscription & Document;

@Schema({ timestamps: true })
export class Subscription {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  planId: string;

  @Prop()
  planName: string;

  @Prop({ default: 'active' })
  status: string; // active, cancelled, expired

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop()
  cancelledAt?: Date;

  @Prop()
  cancelReason?: string;

  @Prop({ default: false })
  autoRenew: boolean;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
