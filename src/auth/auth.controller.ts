import { Controller, Post, Body, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Post('register')
  async register(@Body() body) {
    try {
      const { username, email, password, role } = body;

      if (!username || !email || !password || !role) {
        throw new BadRequestException('Missing required fields');
      }

      const existingUser = await this.usersService.findByEmail(email);
      if (existingUser) {
        throw new BadRequestException('Email already in use');
      }

      const hashedPassword = await this.authService.hashPassword(password);
      const user = await this.usersService.createUser(username, email, hashedPassword, role);

      return { message: 'User registered successfully', user };
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Registration failed');
    }
  }

  @Post('login')
  async login(@Body() body) {
    try {
      const { username, password } = body;

      if (!username || !password) {
        throw new BadRequestException('Username and password are required');
      }

      const user = await this.authService.validateUser(username, password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = await this.authService.generateToken({ id: user._id, role: user.role });

      return { access_token: token };
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Login failed');
    }
  }
}
