import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
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
    console.log('Register endpoint hit:', body); 
    const hashedPassword = await this.authService.hashPassword(body.password);
    const user = await this.usersService.createUser(body.username, body.email, hashedPassword, body.role);
    return { message: 'User registered successfully', user };
  }


  @Post('login')
  async login(@Body() body) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const token = await this.authService.generateToken({ id: user._id, role: user.role });
    return { access_token: token };
  }
}
