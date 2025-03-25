import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:"12233dgshbhjnbnvhdbb", 
    });
  }

  async validate(payload: any) {
    console.log('✅ Decoded Token Payload:', payload);
    return { userId: payload.id, role: payload.role };
  }
}
