import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TimeInterceptor } from './Interceptors/time.interceptor';
import { CartModule } from './cart/cart.module';
import { MattressController } from './mattress/mattress.controller';
import { MattressService } from './mattress/mattress.service';
import { MattressModule } from './mattress/mattress.module';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { CartController } from './cart/cart.controller';
import { OrderController } from './order/order.controller';
import { UserController } from './user/user.controller';
import { PrismaService } from './prisma/prisma.service';
import { CartService } from './cart/cart.service';
import { OrderService } from './order/order.service';
import { HttpExceptionFilter } from './filters/http-excpetion_filter';
import { JwtService } from '@nestjs/jwt';
import { JwtTokensModule } from './jwt_tokens/jwt_tokens.module';
import { JwtTokensService } from './jwt_tokens/jwt_tokens.service';
import { FiltersModule } from './middleware/filters.module';
import { TokenCheckMiddleware } from './middleware/token.check.middleware';
import { WebsocketsModule } from './websockets/websockets.module';
import { MattressInfoChangeWebsocketGateway } from './websockets/mattress.info.change.websocket.gateway';
import { StatisticsModule } from './statistics/statistics.module';
import { StatisticsService } from './statistics/statistics.service';
import { StatisticsMiddleware } from './middleware/statistics.middleware';

@Module({
  controllers: [
    AppController,
    MattressController,
    CartController,
    OrderController,
    UserController,
  ],
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    CartModule,
    MattressModule,
    OrderModule,
    UserModule,
    JwtTokensModule,
    FiltersModule,
    WebsocketsModule,
    StatisticsModule,
  ],
  providers: [
    AppService,
    AuthService,
    UserService,
    PrismaService,
    CartService,
    OrderService,
    MattressService,
    JwtService,
    JwtTokensService,
    MattressInfoChangeWebsocketGateway,
    StatisticsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenCheckMiddleware).forRoutes({
        path: 'mattresses_full_info/mattress_info_page*',
        method: RequestMethod.GET,
      },
      {
        path: 'statistics',
        method: RequestMethod.GET,
      },
    );

    consumer.apply(StatisticsMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
