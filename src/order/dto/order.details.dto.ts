import { IsISO8601, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderDetailsDto {
  @IsNotEmpty()
  @ApiProperty()
  address: string;

  @ApiProperty()
  @IsISO8601()
  date: string;
}
