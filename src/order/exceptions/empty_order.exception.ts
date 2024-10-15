import { HttpException, HttpStatus } from '@nestjs/common';

export class EmptyOrderException extends HttpException {
  constructor() {
    super(`Заказ не может быть пустым!`, HttpStatus.FORBIDDEN);
  }
}
