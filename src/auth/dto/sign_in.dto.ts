import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @IsNotEmpty()
  @ApiProperty()
  login: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
