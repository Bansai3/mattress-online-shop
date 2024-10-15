import { MattressType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsPositive } from 'class-validator';

export class MattressDataDto {
  @ApiProperty()
  type: MattressType;

  @ApiProperty()
  recommended: boolean;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsPositive()
  cost: number;

  @ApiProperty()
  @IsISO8601()
  manufacture_date: string;

  @ApiProperty()
  image_link: string;
}
