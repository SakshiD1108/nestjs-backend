import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class DocumentEntity {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  filePath: string;
}

export type DocumentEntityDocument = DocumentEntity & Document;

export const DocumentSchema = SchemaFactory.createForClass(DocumentEntity);
