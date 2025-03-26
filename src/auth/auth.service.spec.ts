import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private usersService: UsersService) {}

  async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      throw new InternalServerErrorException('Error hashing password');
    }
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new InternalServerErrorException('Error comparing passwords');
    }
  }

  async generateToken(payload: any): Promise<string> {
    try {
      return this.jwtService.sign(payload);
    } catch (error) {
      throw new InternalServerErrorException('Error generating token');
    }
  }

  async validateUser(username: string, password: string) {
    try {
      const user = await this.usersService.findByUsername(username);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const isPasswordValid = await this.comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Error validating user');
    }
  }
}
