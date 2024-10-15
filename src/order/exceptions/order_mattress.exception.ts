import { HttpException, HttpStatus } from '@nestjs/common';

export class OrderMattressNotFoundException extends HttpException {
  constructor(order_id: number, mattress_id: number) {
    super(
      `Заказ с id ${order_id} или марасс с id ${mattress_id} не сущетсвует!`,
      HttpStatus.NOT_FOUND,
    );
  }
}
