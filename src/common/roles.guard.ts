import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../common/roles.decorator';
import * as jwt from 'jsonwebtoken'; 

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    let user = request.user; // Default user extraction

    // If user is undefined, manually decode the JWT
    if (!user) {

        const authHeader = request.headers.authorization;
        if (!authHeader) {
          return false;
        }
      
        const token = authHeader.split(' ')[1];
        console.log('🔹 Extracted Token:', token);
      
        if (!token) {
          return false;
        }
      
        return true;
      }
      
    if (!user || !user.role) {
      console.log('ERROR: No user found or user has no role!');
      return false;
    }

    console.log(' Required Roles:', requiredRoles);
    console.log(' User Role:', user.role);

    return requiredRoles.includes(user.role);
  }
}
