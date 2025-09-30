import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') || 'junior',
    });
  }

  async validate(payload: any) {
    // payload tiene lo que firmaste (sub, userId, roles...)
    // Devuelve el objeto que estará disponible en request.user
    return { userId: payload.sub ?? payload.userId, ...payload };
  }
}
