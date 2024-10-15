import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { cart, Prisma, Role } from '@prisma/client';
import { CartNotFoundException } from './exceptions/cart_not_found.exception';
import { CartMattressConflictException } from './exceptions/cart_mattress_conflict.exception';
import { CartMattressNotFoundException } from './exceptions/cart_mattress_not_found.exception';
import { CartMattressPresenceException } from './exceptions/cart_mattress_presence.excpetion';
import { UserNotFoundException } from '../user/exceptions/user_not_found.exception';
import { UserCartConflictException } from './exceptions/user_cart_conflict.exception';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async findCart(cartWhereUniqueInput: Prisma.cartWhereUniqueInput) {
    return this.prisma.cart.findUnique({ where: cartWhereUniqueInput });
  }

  async findCartWithCheck(
    cartWhereUniqueInput: Prisma.cartWhereUniqueInput,
    request_user_id: number,
  ): Promise<cart | null> {
    const request_user = await this.prisma.user.findUnique({
      where: { id: request_user_id },
    });
    const cart_input: Prisma.cartWhereUniqueInput = {
      user_id: request_user_id,
    };
    const request_user_cart = await this.prisma.cart.findUnique({
      where: cart_input,
    });
    const cart = await this.prisma.cart.findUnique({
      where: cartWhereUniqueInput,
    });
    if (request_user.role == Role.USER && request_user_cart.id != cart.id) {
      throw new UnauthorizedException(
        'Запрещено образаться к корзинам других пользователей!',
      );
    }
    return this.prisma.cart.findUnique({
      where: cartWhereUniqueInput,
    });
  }

  async getAllCarts(): Promise<cart[]> {
    return this.prisma.cart.findMany();
  }
  async addMattressToCartByName(
    request_user_id: number,
    user_id: number,
    mattress_name: string,
  ) {
    const unique_cart_input: Prisma.cartWhereUniqueInput = { user_id: user_id };
    const unique_mattress_input: Prisma.mattressWhereUniqueInput = {
      name: mattress_name,
    };
    const cart = await this.prisma.cart.findUnique({
      where: unique_cart_input,
    });
    const mattress = await this.prisma.mattress.findUnique({
      where: unique_mattress_input,
    });
    if (!cart || !mattress) {
      throw new NotFoundException(
        'Неправильное id пользователя или название матрасса!',
      );
    }
    const mattress_id = Number(mattress.id);
    const cart_id = Number(cart.id);
    return await this.addMattressToCartById(
      {
        mattress_id_cart_id: { mattress_id, cart_id },
      },
      request_user_id,
    );
  }
  async checkRequestUserCart(request_user_id: number, cart_id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: request_user_id },
    });
    if (user == null) {
      throw new UserNotFoundException(request_user_id);
    }
    const cart = await this.prisma.cart.findUnique({
      where: { user_id: request_user_id },
    });
    if (user.role == Role.USER && cart.id != cart_id) {
      throw new UnauthorizedException(
        'Запрещается добавлять матрассы в корзины других пользователей!',
      );
    }
  }

  async addMattressToCartById(
    cart_mattressesWhereUniqueInput: Prisma.cart_mattressesWhereUniqueInput,
    request_user_id: number,
  ) {
    await this.checkRequestUserCart(
      request_user_id,
      cart_mattressesWhereUniqueInput.mattress_id_cart_id.cart_id,
    );
    const cart_mattress = await this.prisma.cart_mattresses.findUnique({
      where: cart_mattressesWhereUniqueInput,
    });
    if (cart_mattress != null) {
      throw new CartMattressConflictException(
        cart_mattressesWhereUniqueInput.mattress_id_cart_id.mattress_id,
      );
    }
    const m: Prisma.mattressWhereUniqueInput = {
      id: Number(
        cart_mattressesWhereUniqueInput.mattress_id_cart_id.mattress_id,
      ),
    };
    const mattress = await this.prisma.mattress.findUnique({ where: m });
    const cart = await this.findCart({
      id: Number(cart_mattressesWhereUniqueInput.mattress_id_cart_id.cart_id),
    });
    if (cart == null || mattress == null) {
      throw new CartMattressNotFoundException(
        cart_mattressesWhereUniqueInput.mattress_id_cart_id.cart_id,
        cart_mattressesWhereUniqueInput.mattress_id_cart_id.mattress_id,
      );
    }
    const mattressTemplate: Prisma.mattressCreateNestedOneWithoutCart_mattressesInput =
      {
        connect: m,
      };
    const cartTemplate: Prisma.cartCreateNestedOneWithoutCart_mattressesInput =
      {
        connect: { id: cart.id },
      };
    const data = { mattress: mattressTemplate, cart: cartTemplate };
    return this.prisma.cart_mattresses.create({ data });
  }

  async deleteMattress(
    cart_mattressesWhereUniqueInput: Prisma.cart_mattressesWhereUniqueInput,
    request_user_id: number,
  ) {
    await this.checkRequestUserCart(
      request_user_id,
      cart_mattressesWhereUniqueInput.mattress_id_cart_id.cart_id,
    );
    const cart_unique_input: Prisma.cartWhereUniqueInput = {
      id: cart_mattressesWhereUniqueInput.mattress_id_cart_id.cart_id,
    };
    const cart = await this.prisma.cart.findUnique({
      where: cart_unique_input,
    });
    if (cart == null) {
      throw new CartNotFoundException(
        cart_mattressesWhereUniqueInput.mattress_id_cart_id.cart_id,
      );
    }
    const c_m = await this.prisma.cart_mattresses.findUnique({
      where: cart_mattressesWhereUniqueInput,
    });
    if (c_m == null) {
      throw new CartMattressPresenceException(
        cart_mattressesWhereUniqueInput.mattress_id_cart_id.cart_id,
        cart_mattressesWhereUniqueInput.mattress_id_cart_id.mattress_id,
      );
    }
    return this.prisma.cart_mattresses.delete({
      where: cart_mattressesWhereUniqueInput,
    });
  }

  async createCart(unique_user_input: Prisma.userWhereUniqueInput) {
    const user_val = await this.prisma.user.findUnique({
      where: unique_user_input,
    });
    if (user_val == null) {
      throw new UserNotFoundException(unique_user_input.id);
    }
    const unique_input_cart: Prisma.cartWhereUniqueInput = {
      user_id: Number(unique_user_input.id),
    };
    const cart = await this.prisma.cart.findUnique({
      where: unique_input_cart,
    });
    if (cart != null) {
      throw new UserCartConflictException(user_val.id);
    }
    const u: Prisma.userCreateNestedOneWithoutCartInput = {
      connect: unique_user_input,
    };
    const data: Prisma.cartCreateInput = { user: u };

    return this.prisma.cart.create({ data: data });
  }

  async clearCart(unique_user_input: Prisma.userWhereUniqueInput) {
    const unique_cart_input: Prisma.cartWhereUniqueInput = {
      user_id: unique_user_input.id,
    };
    const cart = await this.prisma.cart.findUnique({
      where: unique_cart_input,
    });
    const cartMattresses_input: Prisma.cart_mattressesWhereInput = {
      cart_id: cart.id,
    };
    const mattresses = await this.prisma.cart_mattresses.findMany({
      where: cartMattresses_input,
    });
    for (const mattress of mattresses) {
      const mattress_id = mattress.mattress_id;
      const cart_id = mattress.cart_id;
      const unique_cart_mattress_input: Prisma.cart_mattressesWhereUniqueInput =
        { mattress_id_cart_id: { mattress_id, cart_id } };
      await this.prisma.cart_mattresses.delete({
        where: unique_cart_mattress_input,
      });
    }
  }

  async getAllCartMattresses(unique_user_input: Prisma.userWhereUniqueInput) {
    const unique_cart_input: Prisma.cartWhereUniqueInput = {
      user_id: unique_user_input.id,
    };
    const cart = await this.prisma.cart.findUnique({
      where: unique_cart_input,
    });
    if (cart == null) {
      return [];
    }
    const mattress_input: Prisma.cart_mattressesWhereInput = {
      cart_id: cart.id,
    };
    const cart_mattresses = await this.prisma.cart_mattresses.findMany({
      where: mattress_input,
    });
    const mattresses = [];
    for (const m of cart_mattresses) {
      const mattress_object = await this.prisma.mattress.findUnique({
        where: { id: m.mattress_id },
      });
      mattresses.push(mattress_object);
    }
    return mattresses;
  }
}
