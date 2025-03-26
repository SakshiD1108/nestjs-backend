import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET') || '12233dgshbhjnbnvhdbb', // Ensure secret is always defined
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    if (!payload || !payload.id || !payload.role) {
      throw new UnauthorizedException('Invalid token payload');
    }

    console.log('✅ Decoded Token Payload:', payload);
    return { userId: payload.id, role: payload.role };
  }
}
