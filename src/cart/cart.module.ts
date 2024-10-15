import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaService } from '../prisma/prisma.service';
import { MattressService } from '../mattress/mattress.service';
import { OrderService } from '../order/order.service';

@Module({
  controllers: [CartController],
  providers: [OrderService, CartService, PrismaService, MattressService],
})
export class CartModule {}
