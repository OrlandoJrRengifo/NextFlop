import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class SubscriptionPlan {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  maxProfiles: number;
}

// Tipo correcto, incluyendo timestamps que Mongoose agrega automáticamente
export type SubscriptionPlanDocument = Document & {
  readonly _id: string;
  readonly name: string;
  readonly price: number;
  readonly maxProfiles: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};

export const SubscriptionPlanSchema =
  SchemaFactory.createForClass(SubscriptionPlan);
