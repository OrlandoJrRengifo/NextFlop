import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type MediaDocument = Media & Document;

@Schema({ timestamps: true })
export class Media {
  _id: Types.ObjectId; //lo genera Mongo

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  type: string;

  @Prop([String])
  genres: string[];

  @Prop({ default: 0 })
  rating: number;

  @Prop()
  maturityRating: string;

  @Prop()
  releaseYear: number;

  @Prop()
  duration: string;

  @Prop()
  posterUrl: string;

  @Prop()
  trailerUrl: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: 0 })
  averageRating: number;

  @Prop({ default: 0 })
  totalRatings: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
