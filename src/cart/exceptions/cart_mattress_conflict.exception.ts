import { HttpException, HttpStatus } from '@nestjs/common';

export class CartMattressConflictException extends HttpException {
  constructor(mattress_id: number) {
    super(`Матрасс с id ${mattress_id} уже в корзине!`, HttpStatus.CONFLICT);
  }
}
