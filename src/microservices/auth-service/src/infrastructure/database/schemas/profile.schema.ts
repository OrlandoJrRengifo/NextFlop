import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

// Sub-esquema para el historial
const HistoryItemSchema = new MongooseSchema({
  mediaId: { type: MongooseSchema.Types.ObjectId, ref: 'Media' }, // Asume que existe un modelo 'Media'
  watchedAt: { type: Date, default: Date.now },
});

// Sub-esquema para el perfil de gustos
const TasteProfileItemSchema = new MongooseSchema({
  genre: String,
  score: Number,
});

@Schema({ timestamps: true })
export class ProfileDocument extends Document {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  iconUrl: string;

  @Prop({ type: [TasteProfileItemSchema], default: [] })
  tasteProfile: { genre: string, score: number }[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Media' }], default: [] })
  favorites: MongooseSchema.Types.ObjectId[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Media' }], default: [] })
  watchLater: MongooseSchema.Types.ObjectId[];

  @Prop({ type: [HistoryItemSchema], default: [] })
  history: { mediaId: MongooseSchema.Types.ObjectId, watchedAt: Date }[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ProfileSchema = SchemaFactory.createForClass(ProfileDocument);