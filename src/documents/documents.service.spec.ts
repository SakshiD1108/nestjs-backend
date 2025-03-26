import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { DocumentsService } from './documents.service';
import { DocumentEntity } from './document.schema';
import { Model } from 'mongoose';

const mockDocument = {
  _id: '60d0fe4f5311236168a109ca',
  title: 'Test Document',
  description: 'This is a test document',
  filePath: 'uploads/test.pdf',
};

describe('DocumentsService', () => {
  let service: DocumentsService;
  let model: Model<DocumentEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: getModelToken(DocumentEntity.name),
          useValue: {
            create: jest.fn().mockResolvedValue(mockDocument),
            find: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue([mockDocument]),
            }),
            findById: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(mockDocument),
            }),
            findByIdAndUpdate: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(mockDocument),
            }),
            findByIdAndDelete: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(mockDocument),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    model = module.get<Model<DocumentEntity>>(getModelToken(DocumentEntity.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new document', async () => {
    const document = await service.createDocument('Test Document', 'This is a test', 'uploads/test.pdf');
    expect(document).toEqual(mockDocument);
  });

  it('should return all documents', async () => {
    const documents = await service.getAllDocuments();
    expect(documents).toEqual([mockDocument]);
  });

  it('should return a document by ID', async () => {
    const document = await service.getDocumentById('60d0fe4f5311236168a109ca');
    expect(document).toEqual(mockDocument);
  });

  it('should update a document', async () => {
    const updatedDocument = await service.updateDocument('60d0fe4f5311236168a109ca', 'Updated Title', 'Updated Description');
    expect(updatedDocument).toEqual(mockDocument);
  });

  it('should delete a document', async () => {
    const deletedDocument = await service.deleteDocument('60d0fe4f5311236168a109ca');
    expect(deletedDocument).toEqual(mockDocument);
  });
});
