import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Ingestion, IngestionDocument } from './ingestion.schema';

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(
    @InjectModel(Ingestion.name) private ingestionModel: Model<IngestionDocument>,
  ) {}
  async triggerIngestion(data: { source: string; metadata?: string }): Promise<{ message: string; ingestionId: string }> {
    this.logger.log(`Ingestion triggered for source: ${data.source}`);
  
    const ingestion = new this.ingestionModel({
      source: data.source,
      metadata: data.metadata || '',
      status: 'Processing',
    });
  
    const savedIngestion = await ingestion.save() as IngestionDocument;
  
    setTimeout(async () => {
      await this.ingestionModel.findByIdAndUpdate(savedIngestion._id, { status: 'Completed' });
      this.logger.log(`Ingestion completed for source: ${data.source}`);
    }, 5000);
  
    return { 
      message: `Ingestion started for source: ${data.source}`, 
      ingestionId: (savedIngestion._id as Types.ObjectId).toHexString()  // Ensure proper conversion
    };
  }

  async getIngestionStatus(ingestionId: string): Promise<{ status: string }> {
    const ingestion = await this.ingestionModel.findById(ingestionId);
    if (!ingestion) {
      return { status: 'Not Found' };
    }
    return { status: ingestion.status };
  }
}
