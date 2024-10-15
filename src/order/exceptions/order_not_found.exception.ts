import { HttpException, HttpStatus } from '@nestjs/common';

export class OrderNotFoundException extends HttpException {
  constructor(order_id: number) {
    super(`Заказ с id ${order_id} не существует!`, HttpStatus.NOT_FOUND);
  }
}
