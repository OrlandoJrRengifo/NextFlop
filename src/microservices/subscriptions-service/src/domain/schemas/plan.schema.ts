import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlanDocument = Plan & Document;

@Schema({ timestamps: true })
export class Plan {
  @Prop({ required: true, unique: true })
  name: string; // Básico, Estándar, Premium

  @Prop({ required: true })
  price: number;

  @Prop()
  description: string;

  @Prop({ default: 1 })
  maxProfiles: number;

  @Prop({ default: 'SD' })
  maxQuality: string; // SD, HD, 4K

  @Prop({ default: [] })
  features: Array<string>;

  @Prop({ default: true })
  active: boolean;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
