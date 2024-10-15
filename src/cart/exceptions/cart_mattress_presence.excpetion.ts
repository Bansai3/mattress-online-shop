import { HttpException, HttpStatus } from '@nestjs/common';

export class CartMattressPresenceException extends HttpException {
  constructor(cart_id: number, mattress_id: number) {
    super(
      `Корзина с id ${cart_id} не содрежит матрасс с id ${mattress_id}!`,
      HttpStatus.NOT_FOUND,
    );
  }
}
