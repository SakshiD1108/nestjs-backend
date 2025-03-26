import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MongooseModule } from '@nestjs/mongoose';
import { IngestionModule } from '../ingestion/ingestion.module';
import { JwtStrategy } from '../auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

describe('IngestionController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let ingestionId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/test_db'),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        IngestionModule,
      ],
      providers: [JwtStrategy, JwtService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // ✅ Mock JWT Token
    const jwt = require('jsonwebtoken');
    const mockUser = { id: '123456', role: 'admin' };
    accessToken = jwt.sign(mockUser, "12233dgshbhjnbnvhdbb", { expiresIn: '1h' });
  });

  afterAll(async () => {
    await app.close();
  });

  it('should trigger an ingestion', async () => {
    const res = await request(app.getHttpServer())
      .post('/ingestion/trigger')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ source: 'Test Source', metadata: 'Sample Metadata' })
      .expect(201);

    expect(res.body).toHaveProperty('ingestionId');
    ingestionId = res.body.ingestionId;
  });

  it('should return ingestion status', async () => {
    const res = await request(app.getHttpServer())
      .get(`/ingestion/status/${ingestionId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body).toHaveProperty('status');
  });

  it('should return 404 for a non-existent ingestion', async () => {
    await request(app.getHttpServer())
      .get(`/ingestion/status/60d0fe4f5311236168a109ca`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });
});
