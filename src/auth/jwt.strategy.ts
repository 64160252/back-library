import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, // ใช้ Secret Key
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      username: payload.username,
      prefix: payload.user_prefix,
      firstName: payload.user_firstName,
      lastName: payload.user_lastName,
      role: payload.role,
      position_name: payload.position_name,
    };
  }
}
