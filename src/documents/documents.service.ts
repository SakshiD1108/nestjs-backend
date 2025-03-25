import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentEntity } from './document.schema';

@Injectable()
export class DocumentsService {
  constructor(@InjectModel(DocumentEntity.name) private documentModel: Model<DocumentEntity>) {}

  async createDocument(title: string, description: string, filePath: string) {
    const newDoc = new this.documentModel({ title, description, filePath });
    return newDoc.save();
  }

  async getAllDocuments() {
    return this.documentModel.find().exec();
  }

  async getDocumentById(id: string) {
    return this.documentModel.findById(id).exec();
  }

  async updateDocument(id: string, title: string, description: string) {
    return this.documentModel.findByIdAndUpdate(id, { title, description }, { new: true });
  }

  async deleteDocument(id: string) {
    return this.documentModel.findByIdAndDelete(id).exec();
  }
}
