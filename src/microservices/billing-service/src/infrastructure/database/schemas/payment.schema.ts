import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

export enum PaymentStatusEnum {
  SUCCEEDED = "succeeded",
  FAILED = "failed",
  PENDING = "pending", // agregamos pending para uso inicial
}

@Schema({ timestamps: true })
export class PaymentDocument extends Document {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true, index: true })
  subscriptionId: string;

  @Prop({ required: true })
  originalAmount: number;

  @Prop({ type: Number, default: 0 })
  discountApplied: number;

  @Prop({ required: true })
  finalAmount: number;

  @Prop({ type: Number, default: 0 })
  pointsRedeemed: number;

  @Prop({ type: Number, default: 0 })
  pointsGained: number;

  @Prop({
    enum: PaymentStatusEnum,
    required: true,
    default: PaymentStatusEnum.PENDING,
    index: true,
  })
  status: PaymentStatusEnum;

  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  failureDetails: Record<string, any>;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(PaymentDocument);
PaymentSchema.index({ userId: 1, status: 1 });
