import { IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMattressDto {
  @ApiProperty()
  @IsPositive()
  cost: number;
}
