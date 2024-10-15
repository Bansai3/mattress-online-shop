import { Module } from '@nestjs/common';
import { JwtTokensService } from './jwt_tokens.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [JwtTokensService, PrismaService],
})
export class JwtTokensModule {}
