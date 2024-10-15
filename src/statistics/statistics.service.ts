import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  async addStatistics(page: string) {
    const statistics = await this.prisma.statistics.findUnique({
      where: { url: page },
    });
    if (statistics == null) {
      await this.createNewPageStatistics(page);
    } else {
      await this.updatePageStatistics(statistics);
    }
  }

  async getStatistics() {
    const statistics_db = await this.prisma.statistics.findMany();
    const statistics: [number, string][] = statistics_db.map(
      ({ count, url }) => [count, url],
    );
    statistics.sort((a, b) => b[0] - a[0]);
    return statistics;
  }

  async createNewPageStatistics(page: string) {
    const statistics_data: Prisma.statisticsCreateInput = {
      url: page,
      count: 1,
    };
    await this.prisma.statistics.create({ data: statistics_data });
  }

  async updatePageStatistics(page: { id: number; url: string; count: number }) {
    const update_page_input: Prisma.statisticsUpdateInput = {
      count: page.count + 1,
    };
    const unique_statistics_input: Prisma.statisticsWhereUniqueInput = {
      id: page.id,
    };

    await this.prisma.statistics.update({
      data: update_page_input,
      where: unique_statistics_input,
    });
  }
}
