import { HttpException, HttpStatus } from '@nestjs/common';

export class UserCartConflictException extends HttpException {
  constructor(user_id: number) {
    super(
      `Пользователь с id ${user_id} уже имеет корзину!`,
      HttpStatus.CONFLICT,
    );
  }
}
