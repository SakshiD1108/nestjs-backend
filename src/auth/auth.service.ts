import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private usersService: UsersService) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async generateToken(payload: any) {
    const token = this.jwtService.sign(payload)
    return token;
  }
  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (user && (await this.comparePassword(password, user.password))) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}
