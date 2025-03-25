import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IngestionDocument = Ingestion & Document;

@Schema({ timestamps: true })
export class Ingestion {
  @Prop({ required: true })
  source: string;

  @Prop()
  metadata?: string;

  @Prop({ default: 'Idle' })
  status: string;
}

export const IngestionSchema = SchemaFactory.createForClass(Ingestion);
