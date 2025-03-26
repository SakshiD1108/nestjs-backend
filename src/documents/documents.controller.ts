import { 
  Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors, UploadedFile, UseGuards, BadRequestException, 
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Express } from 'express';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';



@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
   @UseGuards(JwtStrategy, RolesGuard)  
    @Roles('admin') 
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', 
      filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const fileExt = extname(file.originalname);
        cb(null, `document-${uniqueSuffix}${fileExt}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image') && !file.mimetype.startsWith('application/pdf')) {
        return cb(new BadRequestException('Only images and PDFs are allowed'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  }))
  async uploadDocument(@Body() body, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File upload failed. Please upload a valid file.');
    }

    return this.documentsService.createDocument(body.title, body.description, file.path);
  }

  @Get()
  async getAllDocuments() {
    return this.documentsService.getAllDocuments();
  }

  @Get(':id')
  async getDocumentById(@Param('id') id: string) {
    return this.documentsService.getDocumentById(id);
  }

  @Put(':id')
  async updateDocument(
  @Param('id') id: string,
  @Body() body: { title: string; description: string }
  ) {
  if (!body || !body.title || !body.description) {
    throw new Error('Invalid request: title or description missing');
  }
  return this.documentsService.updateDocument(id, body.title, body.description);
}


@Delete(':id')
  async deleteDocument(@Param('id') id: string) {
    try {
      // Validate ID format
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new BadRequestException(`Invalid ID format: ${id}`);
      }

      const deletedDoc = await this.documentsService.deleteDocument(id);

      if (!deletedDoc) {
        throw new NotFoundException(`Document with ID ${id} not found`);
      }

      return { message: 'Document deleted successfully', deletedDoc };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error; // Pass specific errors
      }
      throw new InternalServerErrorException('An error occurred while deleting the document');
    }
  }
}
 