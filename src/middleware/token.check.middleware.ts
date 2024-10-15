import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction } from 'express';
import { Request as RequestType } from 'express';
import { JwtTokensService } from '../jwt_tokens/jwt_tokens.service';
import { TokenException } from '../jwt_tokens/excpetions/token.exception';
import { StatisticsService } from '../statistics/statistics.service';

@Injectable()
export class TokenCheckMiddleware implements NestMiddleware {
  constructor(
    private jwtTokenService: JwtTokensService,
    private statisticsService: StatisticsService,
  ) {}
  async use(req: RequestType, resp: Response, next: NextFunction) {
    if (req.cookies && 'user_token' in req.cookies) {
      const token = String(req.cookies.user_token);
      const token_owner = await this.jwtTokenService.getToken({ value: token });
      if (token_owner == null) {
        throw new TokenException('Пользователь не авторизован!');
      } else {
        next();
        return;
      }
    }
    throw new TokenException('Пользователь не авторизован!');
  }
}
