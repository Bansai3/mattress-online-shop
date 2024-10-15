import { ExceptionFilter, Catch, ArgumentsHost, } from '@nestjs/common';
import { Response } from 'express';
import { TokenException } from '../jwt_tokens/excpetions/token.exception';
import { ConfigService } from '@nestjs/config';

@Catch(TokenException)
export class TokenExceptionFilter implements ExceptionFilter {
  catch(exception: TokenException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const configService = new ConfigService();

    response.status(404);
    response.redirect(
      `${configService.get('REF')}/registration/sign_in_page`,
    );
  }
}
