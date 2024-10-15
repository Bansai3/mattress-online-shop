import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Status } from '@prisma/client';
import { MattressNotFoundException } from './excpetions/mattress_not_found.exception';
import { InvalidDateException } from './excpetions/invalid_date.exception';

@Injectable()
export class MattressService {
  constructor(private prisma: PrismaService) {}

  async findMattressById(
    mattressWhereUniqueInput: Prisma.mattressWhereUniqueInput,
  ) {
    const mattress = await this.prisma.mattress.findUnique({
      where: mattressWhereUniqueInput,
    });
    if (mattress == null) {
      throw new MattressNotFoundException(mattressWhereUniqueInput.id);
    }
    return mattress;
  }

  async findMattressByName(mattress_name: string) {
    return this.prisma.mattress.findUnique({
      where: { name: mattress_name },
    });
  }

  async getAllMattresses() {
    return this.prisma.mattress.findMany();
  }

  async createMattress(data: Prisma.mattressCreateInput) {
    await this.validateDate(new Date(data.manufacture_date));
    return this.prisma.mattress.create({ data });
  }

  async deleteMattress(where: Prisma.mattressWhereUniqueInput) {
    const mattress = await this.prisma.mattress.findUnique({
      where,
    });
    if (mattress == null) {
      throw new MattressNotFoundException(where.id);
    }
    return this.prisma.mattress.delete({ where });
  }

  async validateDate(date: Date) {
    if (date.getTime() > Date.now()) {
      throw new InvalidDateException('Дата создания позже текущей даты!');
    }
  }

  async updateMattressStatus(
    unique_mattress_input: Prisma.mattressWhereUniqueInput,
    status: Status,
  ) {
    const update_mattress_input: Prisma.mattressUpdateInput = {
      status: status,
    };
    await this.prisma.mattress.update({
      data: update_mattress_input,
      where: unique_mattress_input,
    });
  }
  async getOrderMattresses(order_input: Prisma.orderWhereInput) {
    const order_mattresses_input: Prisma.order_mattressesWhereInput = {
      order_id: Number(order_input.id),
    };
    const order_mattresses = await this.prisma.order_mattresses.findMany({
      where: order_mattresses_input,
    });
    const mattresses = [];
    for (const order_mattress of order_mattresses) {
      const mattress = await this.prisma.mattress.findUnique({
        where: { id: order_mattress.mattress_id },
      });
      mattresses.push(mattress);
    }
    return mattresses;
  }

  async updateMattressCost(cost: number, mattress_id: number) {
    const unique_input_mattress = { id: mattress_id };
    const update_input_mattress: Prisma.mattressUpdateInput = { cost: cost };
    return this.prisma.mattress.update({
      data: update_input_mattress,
      where: unique_input_mattress,
    });
  }
}
