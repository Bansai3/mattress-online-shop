import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor(user_id: number) {
    super(`Пользователь с id ${user_id} не существует!`, HttpStatus.NOT_FOUND);
  }
}
