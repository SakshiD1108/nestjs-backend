import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => {
  console.log('🔹 Setting roles:', roles); 
  return SetMetadata(ROLES_KEY, roles);
};
