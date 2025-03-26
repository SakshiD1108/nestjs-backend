import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { UserRole } from '../users/user.schema';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

describe('Users E2E', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let accessToken: string;
  let usersService: UsersService;

  const mockUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'Test@123',
    role: UserRole.ADMIN,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
    usersService = moduleFixture.get<UsersService>(UsersService);

    // Create a test user directly in the database
    await usersService.createUser(mockUser.username, mockUser.email, mockUser.password, mockUser.role);

    // Generate JWT token for authentication
    accessToken = jwtService.sign({ id: 'test-user-id', role: UserRole.ADMIN });
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should register a new user', async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'NewPass@123',
        role: UserRole.EDITOR,
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('message', 'User registered successfully');
        expect(res.body.user).toHaveProperty('username', 'newuser');
      });
  });

  it('Should login a user and return a JWT token', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'testuser',
        password: 'Test@123',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('access_token');
      });
  });

  it(' Should fetch all users (Admin only)', async () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body[0]).toHaveProperty('email', 'test@example.com');
      });
  });

  it('✅ Should update a user role (Admin only)', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`);
    
    const userId = response.body[0]._id;

    return request(app.getHttpServer())
      .put(`/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ role: UserRole.EDITOR })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('role', UserRole.EDITOR);
      });
  });

  it(' Should NOT fetch users without a valid token', async () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(401);
  });

  it(' Should NOT allow a non-admin user to update roles', async () => {
    const userToken = jwtService.sign({ id: 'normal-user-id', role: UserRole.VIEWER });

    return request(app.getHttpServer())
      .put(`/users/12345`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ role: UserRole.ADMIN })
      .expect(403);
  });
});
