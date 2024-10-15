import { IsEmail, IsNotEmpty, IsPositive } from 'class-validator';
import { Role, UserStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsPositive()
  @ApiProperty()
  id: number;

  @IsNotEmpty()
  @ApiProperty()
  fio: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @ApiProperty()
  role: Role;

  @ApiProperty()
  status: UserStatus;
}
