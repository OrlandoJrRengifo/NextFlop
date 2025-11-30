import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

// Sub-esquema para el historial
const HistoryItemSchema = new MongooseSchema({
  // CAMBIO: Usamos String para referenciar Media UUIDs
  mediaId: { type: String, ref: 'Media' }, 
  watchedAt: { type: Date, default: Date.now },
}, { _id: false }); // No necesitamos ID para subdocumentos simples

// Sub-esquema para el perfil de gustos
const TasteProfileItemSchema = new MongooseSchema({
  genre: String,
  score: Number,
}, { _id: false });

@Schema({ timestamps: true })
export class ProfileDocument extends Document {
  // CRÍTICO: ID como String (UUID)
  @Prop({ type: String })
  _id: string;

  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  iconUrl: string;

  @Prop({ type: [TasteProfileItemSchema], default: [] })
  tasteProfile: { genre: string, score: number }[];

  // CAMBIO: Array de Strings (UUIDs) en lugar de ObjectIds
  @Prop({ type: [{ type: String, ref: 'Media' }], default: [] })
  favorites: string[];

  // CAMBIO: Array de Strings (UUIDs) en lugar de ObjectIds
  @Prop({ type: [{ type: String, ref: 'Media' }], default: [] })
  watchLater: string[];

  @Prop({ type: [HistoryItemSchema], default: [] })
  history: { mediaId: string, watchedAt: Date }[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ProfileSchema = SchemaFactory.createForClass(ProfileDocument);