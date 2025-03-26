import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: "sffshjskjja",// Ensure JWT_SECRET is in .env
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers:[AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService ,JwtModule, PassportModule, JwtStrategy],
})
export class AuthModule {}
