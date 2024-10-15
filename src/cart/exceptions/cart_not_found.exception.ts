import { HttpException, HttpStatus } from '@nestjs/common';

export class CartNotFoundException extends HttpException {
  constructor(cart_id: number) {
    super(`Корзина с id ${cart_id} не существует!`, HttpStatus.NOT_FOUND);
  }
}
