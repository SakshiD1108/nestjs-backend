import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { DocumentEntity, DocumentSchema } from './document.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DocumentEntity.name, schema: DocumentSchema }]), // ✅ Correct Model Registration
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
