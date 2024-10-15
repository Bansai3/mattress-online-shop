import { HttpException, HttpStatus } from '@nestjs/common';

export class MattressNotFoundException extends HttpException {
  constructor(mattress_id: number | string) {
    super(
      `Матрасс с именем/id ${mattress_id} не существует!`,
      HttpStatus.NOT_FOUND,
    );
  }
}
