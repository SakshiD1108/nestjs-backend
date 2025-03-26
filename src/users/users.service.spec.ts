import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from './user.schema';

const mockUser = {
  _id: '1',
  username: 'testuser',
  email: 'test@example.com',
  password: 'hashedPassword',
  role: 'admin',
};

describe('UsersService', () => {
  let usersService: UsersService;
  let userModel: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            find: jest.fn().mockResolvedValue([mockUser]),
            findByIdAndUpdate: jest.fn(),
            save: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  it('should find a user by email', async () => {
    (userModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    const user = await usersService.findByEmail('test@example.com');
    expect(user).toEqual(mockUser);
  });

  it('should return all users', async () => {
    const users = await usersService.findAll();
    expect(users).toEqual([mockUser]);
  });

  it('should create a new user', async () => {
    (userModel.create as jest.Mock).mockResolvedValue(mockUser);
    const user = await usersService.createUser(
      'testuser',
      'test@example.com',
      'password',
      UserRole.ADMIN  
    );
    expect(user).toEqual(mockUser);
  });
  
  it('should update user role', async () => {
    (userModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUser);
    const updatedUser = await usersService.updateRole('1', UserRole.EDITOR);  
    expect(updatedUser).toEqual(mockUser);
  });
});
