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
      offer_position: payload.offer_position,
      position_name: payload.position_name,
      management_position_name: payload.management_position_name,
      store_name: payload.store_name,
      role: payload.role,
      faculty: payload.faculty,
      department: payload.department,
      tel: payload.user_tel,
      email: payload.user_email,
    };
  }
}
