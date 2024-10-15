import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma, Role, Status } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { MattressService } from '../mattress/mattress.service';
import { OrderNotFoundException } from './exceptions/order_not_found.exception';
import { UserNotFoundException } from '../user/exceptions/user_not_found.exception';
import { EmptyOrderException } from './exceptions/empty_order.exception';
import { OrderMattressNotFoundException } from './exceptions/order_mattress.exception';
import { MattressStatusException } from '../mattress/excpetions/mattress_status.exception';
import { OrderDetailsDto } from './dto/order.details.dto';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private mattressService: MattressService,
    private cartService: CartService,
  ) {}
  async findOrder(
    orderWhereUniqueInput: Prisma.orderWhereUniqueInput,
    request_user_id: number,
  ) {
    const order = await this.prisma.order.findUnique({
      where: orderWhereUniqueInput,
    });
    if (order == null) {
      throw new OrderNotFoundException(orderWhereUniqueInput.id);
    }
    const user = await this.prisma.user.findUnique({
      where: { id: request_user_id },
    });
    if (user.role == Role.USER && order.user_id != user.id) {
      throw new UnauthorizedException(
        'Запрещено получать инфориацию о чужих заказах!',
      );
    }
    return order;
  }

  async getAllOrders() {
    return this.prisma.order.findMany();
  }

  async getUserOrders(order_input: Prisma.orderWhereInput) {
    return this.prisma.order.findMany({ where: order_input });
  }

  async getUsersCartMattresses(userWhereInput: Prisma.userWhereUniqueInput) {
    const unique_cart_input: Prisma.cartWhereUniqueInput = {
      user_id: userWhereInput.id,
    };
    const cart = await this.prisma.cart.findUnique({
      where: unique_cart_input,
    });
    const cartMattresses_input: Prisma.cart_mattressesWhereInput = {
      cart_id: cart.id,
    };
    return this.prisma.cart_mattresses.findMany({
      where: cartMattresses_input,
    });
  }

  async createOrder(
    userWhereInput: Prisma.userWhereUniqueInput,
    order_details_dto: OrderDetailsDto,
    request_user_id: number,
  ) {
    const user = await this.prisma.user.findUnique({ where: userWhereInput });
    if (user == null) {
      throw new UserNotFoundException(userWhereInput.id);
    }
    if (user.role == Role.USER && request_user_id != userWhereInput.id) {
      throw new UnauthorizedException(
        'Запрещено создавать заказы у других пользователей!',
      );
    }
    const nest_user: Prisma.userCreateNestedOneWithoutOrdersInput = {
      connect: userWhereInput,
    };
    const mattresses = await this.getUsersCartMattresses({ id: user.id });
    if (mattresses.length == 0) {
      throw new EmptyOrderException();
    }
    const cost = await this.getMattressesCost(mattresses);
    await this.checkMattressesStatus(mattresses);
    const orderCreateInput: Prisma.orderCreateInput = {
      address: order_details_dto.address,
      date: new Date(order_details_dto.date),
      cost: cost,
      user: nest_user,
    };
    const created_order = await this.prisma.order.create({
      data: orderCreateInput,
    });
    for (const mattress of mattresses) {
      const mattress_id = mattress.mattress_id;
      await this.addMattressToOrder(mattress_id, created_order.id);
    }
    await this.cartService.clearCart({ id: user.id });
    return [created_order, mattresses];
  }

  async getMattressesCost(
    mattresses: { mattress_id: number; cart_id: number }[],
  ) {
    let cost: number = 0;
    for (const mattress of mattresses) {
      const mui: Prisma.mattressWhereUniqueInput = { id: mattress.mattress_id };
      const m: Prisma.mattressCreateInput =
        await this.prisma.mattress.findUnique({ where: mui });
      cost += Number(m.cost);
    }
    return cost;
  }

  async addMattressToOrder(mattress_id: number, order_id: number) {
    const unique_order_input: Prisma.orderWhereUniqueInput = { id: order_id };
    const unique_mattress_input: Prisma.mattressWhereUniqueInput = {
      id: mattress_id,
    };
    const order = await this.prisma.order.findUnique({
      where: unique_order_input,
    });
    const mattress = await this.prisma.mattress.findUnique({
      where: unique_mattress_input,
    });

    if (order == null || mattress == null) {
      throw new OrderMattressNotFoundException(order_id, mattress_id);
    }

    const mcn: Prisma.mattressCreateNestedOneWithoutOrder_mattressesInput = {
      connect: unique_mattress_input,
    };
    const ocn: Prisma.orderCreateNestedOneWithoutOrder_mattressesInput = {
      connect: unique_order_input,
    };

    const orderMattressCreateInput: Prisma.order_mattressesCreateInput = {
      mattress: mcn,
      order: ocn,
    };

    await this.mattressService.updateMattressStatus(
      unique_mattress_input,
      Status.SOLD,
    );
    return this.prisma.order_mattresses.create({
      data: orderMattressCreateInput,
    });
  }

  async deleteOrder(unique_input_order: Prisma.orderWhereUniqueInput) {
    const order = await this.prisma.order.findUnique({
      where: unique_input_order,
    });
    if (order == null) {
      throw new OrderNotFoundException(unique_input_order.id);
    }
    const order_mattresses_input: Prisma.order_mattressesWhereInput = {
      order_id: order.id,
    };
    const order_mattresses = await this.prisma.order_mattresses.findMany({
      where: order_mattresses_input,
    });
    for (const order_mattress of order_mattresses) {
      const order_id = order_mattress.order_id;
      const mattress_id = order_mattress.mattress_id;
      const unique_order_mattress_input: Prisma.order_mattressesWhereUniqueInput =
        { mattress_id_order_id: { mattress_id, order_id } };
      await this.prisma.order_mattresses.delete({
        where: unique_order_mattress_input,
      });
    }
    return this.prisma.order.delete({ where: unique_input_order });
  }
  async checkMattressesStatus(
    mattresses: { mattress_id: number; cart_id: number }[],
  ) {
    for (const mattress of mattresses) {
      const unique_mattress_input: Prisma.mattressWhereUniqueInput = {
        id: mattress.mattress_id,
      };
      const mattress_object = await this.prisma.mattress.findUnique({
        where: unique_mattress_input,
      });
      if (mattress_object.status == Status.SOLD) {
        throw new MattressStatusException(mattress_object.id);
      }
    }
  }
}
