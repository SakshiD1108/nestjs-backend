import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentEntity, DocumentEntityDocument } from './document.schema';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(DocumentEntity.name) private readonly documentModel: Model<DocumentEntityDocument>,
  ) {}

  async createDocument(title: string, description: string, filePath: string) {
    const newDoc = new this.documentModel({ title, description, filePath });
    return newDoc.save();
  }

  async getAllDocuments() {
    return this.documentModel.find();
  }

  async getDocumentById(id: string) {
    return this.documentModel.findById(id);
  }

  async updateDocument(id: string, title: string, description: string) {
    return this.documentModel.findByIdAndUpdate(
      id,
      { title, description },
      { new: true },
    );
  }

  async deleteDocument(id: string) {
    return this.documentModel.findByIdAndDelete(id);
  }
}
