import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { Request as RequestType } from 'express';
import { StatisticsService } from '../statistics/statistics.service';

@Injectable()
export class StatisticsMiddleware implements NestMiddleware {
  constructor(private statisticsService: StatisticsService) {}
  async use(req: RequestType, resp: Response, next: NextFunction) {
    await this.statisticsService.addStatistics(req.url);
    next();
  }
}
