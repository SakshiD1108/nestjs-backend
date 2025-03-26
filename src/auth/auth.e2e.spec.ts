import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('Authentication API (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe()); // Enables DTO validation
    await app.init();
  });

  it('should register a new user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'Test@123',
        role: 'editor',
      })
      .expect(201);

    expect(res.body).toHaveProperty('message', 'User registered successfully');
    expect(res.body.user).toHaveProperty('username', 'testuser');
  });

  it('should fail to register a user with missing fields', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: 'testuser2',
        password: 'Test@123',
      })
      .expect(400);
  });

  it('should login and return a JWT token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'testuser',
        password: 'Test@123',
      })
      .expect(200);

    expect(res.body).toHaveProperty('access_token');
    accessToken = res.body.access_token;
  });

  it('should fail login with incorrect credentials', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'testuser',
        password: 'wrongpassword',
      })
      .expect(401);
  });

  it('should access protected route with valid token', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/protected')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body).toHaveProperty('message', 'Protected route accessed');
  });

  it('should reject access to protected route without token', async () => {
    await request(app.getHttpServer())
      .get('/auth/protected')
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
