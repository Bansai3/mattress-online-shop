import { IsNotEmpty, IsPositive } from 'class-validator';

export class WebsocketChangeMattressDto {
  @IsPositive()
  id: number;

  @IsNotEmpty()
  field: string;

  @IsNotEmpty()
  new_value: string;
}
