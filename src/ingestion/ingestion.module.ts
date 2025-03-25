import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Ingestion, IngestionSchema } from './ingestion.schema';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Ingestion.name, schema: IngestionSchema }])],
  controllers: [IngestionController],
  providers: [IngestionService],
})
export class IngestionModule {}
