import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [StatisticsService, PrismaService],
})
export class StatisticsModule {}
