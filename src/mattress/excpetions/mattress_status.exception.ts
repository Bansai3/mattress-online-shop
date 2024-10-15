import { HttpException, HttpStatus } from '@nestjs/common';

export class MattressStatusException extends HttpException {
  constructor(mattress_id: number) {
    super(
      `Матрасс с id ${mattress_id} уже продан, невозможно добавить его в заказ!`,
      HttpStatus.NOT_FOUND,
    );
  }
}
