import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { MattressService } from '../mattress/mattress.service';
import { UserService } from '../user/user.service';
import { WebsocketsModule } from '../websockets/websockets.module';

@Module({
  controllers: [OrderController],
  providers: [
    OrderService,
    PrismaService,
    CartService,
    MattressService,
    UserService,
  ],
  imports: [WebsocketsModule],
})
export class OrderModule {}
