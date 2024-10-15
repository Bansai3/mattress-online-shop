import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Status, UserStatus } from '@prisma/client';
import { UpdateUserDto } from './dto/update.user.dto';
import { OrderService } from '../order/order.service';
import { UserNotFoundException } from './exceptions/user_not_found.exception';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private orderService: OrderService,
  ) {}

  public async findUniqueUser(unique_user_input: Prisma.userWhereUniqueInput) {
    const user = await this.prisma.user.findUnique({
      where: unique_user_input,
    });
    if (user == null) {
      throw new UserNotFoundException(unique_user_input.id);
    }
    return user;
  }

  public async findUser(user_input: Prisma.userWhereInput) {
    return this.prisma.user.findFirst({ where: user_input });
  }

  public async getAllUsers() {
    return this.prisma.user.findMany();
  }

  public async createUser(data: Prisma.userCreateInput) {
    return this.prisma.user.create({ data });
  }

  public async deleteUser(unique_user_input: Prisma.userWhereUniqueInput) {
    const user = await this.prisma.user.findUnique({
      where: unique_user_input,
    });
    if (user == null) {
      throw new UserNotFoundException(unique_user_input.id);
    }
    await this.deleteUsersCart(unique_user_input);
    await this.deleteUsersOrders(unique_user_input);
    return this.prisma.user.delete({ where: unique_user_input });
  }

  public async updateUser(updateUserDto: UpdateUserDto) {
    const unique_user_input: Prisma.userWhereUniqueInput = {
      id: updateUserDto.id,
    };
    const user = await this.prisma.user.findUnique({
      where: unique_user_input,
    });
    if (user == null) {
      throw new UserNotFoundException(updateUserDto.id);
    }

    const data: Prisma.userUpdateInput = {
      fio: updateUserDto.fio,
      email: updateUserDto.email,
      role: updateUserDto.role,
      status: updateUserDto.status,
    };

    return this.prisma.user.update({ where: unique_user_input, data });
  }

  async deleteUsersCart(unique_user_input: Prisma.userWhereUniqueInput) {
    const unique_cart_input: Prisma.cartWhereUniqueInput = {
      user_id: unique_user_input.id,
    };
    const cart_mattresses_input: Prisma.cart_mattressesWhereInput = {
      cart_id: unique_cart_input.id,
    };
    const cart_mattresses = await this.prisma.cart_mattresses.findMany({
      where: cart_mattresses_input,
    });
    for (const cart_mattress of cart_mattresses) {
      const cart_id = cart_mattress.cart_id;
      const mattress_id = cart_mattress.mattress_id;
      const cart_mattress_unique_input: Prisma.cart_mattressesWhereUniqueInput =
        { mattress_id_cart_id: { mattress_id, cart_id } };
      await this.prisma.cart_mattresses.delete({
        where: cart_mattress_unique_input,
      });
    }
    await this.prisma.cart.delete({ where: unique_cart_input });
  }

  async deleteUsersOrders(unique_user_input: Prisma.userWhereUniqueInput) {
    const order_input: Prisma.orderWhereInput = {
      user_id: unique_user_input.id,
    };
    const orders = await this.prisma.order.findMany({ where: order_input });
    for (const order of orders) {
      const unique_order_input: Prisma.orderWhereUniqueInput = { id: order.id };
      await this.orderService.deleteOrder(unique_order_input);
    }
  }
  async updateUserStatus(
    unique_user_input: Prisma.userWhereUniqueInput,
    status: UserStatus,
  ) {
    const update_user_input: Prisma.userUpdateInput = {
      status: status,
    };
    await this.prisma.user.update({
      data: update_user_input,
      where: unique_user_input,
    });
  }
}
