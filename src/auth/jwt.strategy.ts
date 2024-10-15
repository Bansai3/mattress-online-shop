import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from './types/types';
import { Request as RequestType } from 'express';
import { JwtTokensService } from '../jwt_tokens/jwt_tokens.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtTokenService: JwtTokensService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  private static extractJWT(req: RequestType): string | null {
    if (
      req.cookies &&
      'user_token' in req.cookies &&
      req.cookies.user_token.length > 0
    ) {
      return req.cookies.user_token;
    }
    const jwtService = new JwtService();
    const confService = new ConfigService();
    return jwtService.sign(
      {
        id: -1,
        login: '',
      },
      {
        secret: confService.get('JWT_SECRET'),
        expiresIn: '30d',
      },
    );
  }

  async validate(user: IUser) {
    const token_in_db = await this.jwtTokenService.getToken({
      user_id: user.id,
    });
    if (!token_in_db) {
      return { id: -1, login: '' };
    }
    return { id: user.id, login: user.login };
  }
}
