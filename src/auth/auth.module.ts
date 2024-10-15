import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { CartService } from '../cart/cart.service';
import { OrderService } from '../order/order.service';
import { MattressService } from '../mattress/mattress.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { JwtTokensService } from '../jwt_tokens/jwt_tokens.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '30d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    PrismaService,
    UserService,
    CartService,
    OrderService,
    MattressService,
    LocalStrategy,
    JwtStrategy,
    ConfigService,
    JwtTokensService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
