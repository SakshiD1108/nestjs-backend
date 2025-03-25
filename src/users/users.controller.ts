import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from './user.schema';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtStrategy, RolesGuard)  // ✅ Correct authentication guard
  @Roles('admin') 
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Post()
  @UseGuards(JwtStrategy, RolesGuard) 
  @Roles('admin') 
  async createUser(@Body() body) {
    const { username, email, password, role } = body;
    return this.usersService.createUser(username, email, password, role);
  }

  @Put(':id')
  @UseGuards(JwtStrategy, RolesGuard)  
  @Roles('admin')  
  async updateUserRole(@Param('id') id: string, @Body() body) {
    return this.usersService.updateRole(id, body.role);
  }
}
