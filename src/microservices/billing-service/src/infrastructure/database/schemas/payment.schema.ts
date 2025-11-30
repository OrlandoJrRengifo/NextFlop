import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { PaymentStatus } from "../../../domain/entities/payment.entity";

@Schema({ timestamps: true })
export class PaymentDocument extends Document {
  @Prop({ type: String })
  _id: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  subscriptionId: string;

  @Prop({ required: true })
  originalAmount: number;

  @Prop({ default: 0 })
  discountApplied: number;

  @Prop({ required: true })
  finalAmount: number;

  @Prop({ default: 0 })
  pointsRedeemed: number;

  @Prop({ default: 0 })
  pointsGained: number;

  @Prop({
    required: true,
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Prop({ type: Object, default: {} })
  failureDetails: Record<string, any>;

  createdAt: Date;
  updatedAt: Date;

  @Prop()
  cardLast4?: string;

  @Prop()
  cardBrand?: string;

  @Prop()
  expiration?: string;

  @Prop()
  nameOnCard?: string;
}

export const PaymentSchema = SchemaFactory.createForClass(PaymentDocument);