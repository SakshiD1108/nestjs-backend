import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import { getModelToken } from '@nestjs/mongoose';
import { Ingestion, IngestionDocument } from './ingestion.schema';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

import { Types } from 'mongoose';

const mockIngestion = {
  _id: new Types.ObjectId().toString(),
  source: 'Test Source',
  metadata: 'Sample Metadata',
  status: 'Processing',
};
const mockIngestionModel = {
  create: jest.fn().mockResolvedValue(mockIngestion), // ✅ Corrected `create` mock
  findById: jest.fn().mockImplementation((id) => ({
    exec: jest.fn().mockResolvedValue(id === mockIngestion._id ? mockIngestion : null),
  })),
  findByIdAndUpdate: jest.fn().mockImplementation((_id, update) => ({
    exec: jest.fn().mockResolvedValue({ ...mockIngestion, ...update }),
  })),
};

describe('IngestionService', () => {
  let service: IngestionService;
  let model: Model<IngestionDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: getModelToken(Ingestion.name),
          useValue: mockIngestionModel,
        },
      ],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
    model = module.get<Model<IngestionDocument>>(getModelToken(Ingestion.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should trigger an ingestion and return ingestionId', async () => {
    const result = await service.triggerIngestion({ source: 'Test Source', metadata: 'Sample Metadata' });

    expect(result).toHaveProperty('message', 'Ingestion started for source: Test Source');
    expect(result).toHaveProperty('ingestionId', mockIngestion._id);
    expect(model.create).toHaveBeenCalledWith(
      expect.objectContaining({ source: 'Test Source', status: 'Processing' })
    );
  });

  it('should return ingestion status', async () => {
    const result = await service.getIngestionStatus(mockIngestion._id);
    expect(result).toHaveProperty('status', 'Processing');
  });

  it('should throw NotFoundException if ingestion does not exist', async () => {
    await expect(service.getIngestionStatus('invalid_id')).rejects.toThrow(NotFoundException);
  });
});
