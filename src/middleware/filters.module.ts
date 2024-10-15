import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TokenExceptionFilter } from './excpetion.handler';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: TokenExceptionFilter,
    },
    ConfigService,
  ],
})
export class FiltersModule {}
