import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { OrderService } from '../order/order.service';
import { CartService } from '../cart/cart.service';
import { MattressService } from '../mattress/mattress.service';
import { JwtService } from '@nestjs/jwt';
import { JwtTokensService } from '../jwt_tokens/jwt_tokens.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    AuthService,
    OrderService,
    CartService,
    MattressService,
    JwtService,
    JwtTokensService,
  ],
})
export class UserModule {}
