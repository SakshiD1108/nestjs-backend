import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsModule } from '../documents/documents.module';
import { DocumentEntity, DocumentSchema } from '../documents/document.schema';
import { JwtStrategy } from '../auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';

describe('DocumentsController (e2e)', () => {
  let app: INestApplication;
  let createdDocumentId: string;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),  
        MongooseModule.forRoot('mongodb://localhost:27017/test_db'),
        MongooseModule.forFeature([{ name: DocumentEntity.name, schema: DocumentSchema }]),
        AuthModule,  
        DocumentsModule,
      ],
    }).compile();
  
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });

  /**
   * 1️⃣ Mock JWT Authentication
   */
  it('should return a mock token for testing', async () => {
    // Normally, this token would be obtained by logging in.
    // Since we don't have a real auth system in place, we generate a mock token.
    const mockUser = { id: '123456', role: 'admin' };

    // Generate a token using the same secret key as in JwtStrategy
    const jwt = require('jsonwebtoken');
    accessToken = jwt.sign(mockUser, "12233dgshbhjnbnvhdbb", { expiresIn: '1h' });

    expect(accessToken).toBeDefined();
  });

  /**
   * 2️⃣ Upload a Document
   */
  it('should upload a document', async () => {
    const res = await request(app.getHttpServer())
      .post('/documents/upload')
      .set('Authorization', `Bearer ${accessToken}`)
      .field('title', 'Test Document')
      .field('description', 'This is a test document')
      .attach('file', 'test/test-file.pdf') // Ensure this file exists in your test directory
      .expect(201);

    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe('Test Document');
    expect(res.body.description).toBe('This is a test document');

    createdDocumentId = res.body._id;
  });

  /**
   * 3️⃣ Get All Documents
   */
  it('should get all documents', async () => {
    const res = await request(app.getHttpServer())
      .get('/documents')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  /**
   * 4️⃣ Get a Document by ID
   */
  it('should get a document by ID', async () => {
    const res = await request(app.getHttpServer())
      .get(`/documents/${createdDocumentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body._id).toBe(createdDocumentId);
  });

  /**
   * 5️⃣ Update a Document
   */
  it('should update a document', async () => {
    const res = await request(app.getHttpServer())
      .put(`/documents/${createdDocumentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Updated Title', description: 'Updated Description' })
      .expect(200);

    expect(res.body.title).toBe('Updated Title');
    expect(res.body.description).toBe('Updated Description');
  });

  /**
   * 6️⃣ Delete a Document
   */
  it('should delete a document', async () => {
    await request(app.getHttpServer())
      .delete(`/documents/${createdDocumentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  /**
   * 7️⃣ Get a Non-Existent Document (404)
   */
  it('should return 404 for a non-existent document', async () => {
    await request(app.getHttpServer())
      .get(`/documents/60d0fe4f5311236168a109ca`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });
});
