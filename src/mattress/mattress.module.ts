import { Module } from '@nestjs/common';
import { MattressController } from './mattress.controller';
import { MattressService } from './mattress.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { OrderService } from '../order/order.service';
import { CartService } from '../cart/cart.service';
import { WebsocketsModule } from '../websockets/websockets.module';

@Module({
  controllers: [MattressController],
  providers: [
    MattressService,
    PrismaService,
    UserService,
    OrderService,
    CartService,
  ],
  imports: [WebsocketsModule],
})
export class MattressModule {}
