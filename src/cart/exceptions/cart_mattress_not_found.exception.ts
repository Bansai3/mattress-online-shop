import { HttpException, HttpStatus } from '@nestjs/common';

export class CartMattressNotFoundException extends HttpException {
  constructor(cart_id: number, mattress_id: number | string) {
    super(
      `Корзины с id ${cart_id} или матрасса с id/именем ${mattress_id} не существует!`,
      HttpStatus.NOT_FOUND,
    );
  }
}
