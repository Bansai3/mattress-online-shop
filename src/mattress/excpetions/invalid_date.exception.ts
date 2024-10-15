import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidDateException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN);
  }
}
