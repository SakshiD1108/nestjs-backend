import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from './user.schema';

@Injectable()
export class UsersService {
  
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email })
  }
  
  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id)
  }

  // 🔹 Get all users (Only for Admin)
  async findAll(): Promise<User[]> {
    return this.userModel.find()
  }

  // 🔹 Find user by username
  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  // 🔹 Create a new user (Publicly Accessible)
  async createUser(username: string, email: string,password: string, role:UserRole): Promise<User> {
    if (!email) {
      throw new Error('Email is required');
    }
  
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
  
    const newUser = new this.userModel({ username,email, password, role });
    return newUser.save();
  }

  // 🔹 Update user role (Admin Only)
  async updateRole(id: string, role: UserRole): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, { role }, { new: true }).exec();
  }
}
