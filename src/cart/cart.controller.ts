import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../user/roles/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from '../user/roles/roles.guard';
import { Response } from 'express';

@ApiTags('carts')
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Roles(Role.ADMIN, Role.USER)
  @Get('/cart:cart_id')
  @ApiOperation({
    summary: 'Get cart by id',
  })
  @ApiParam({ name: 'cart_id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Cart successfully found',
  })
  async getCart(
    @Param('cart_id') cart_id: number,
    @Req() req,
    @Res() response: Response,
  ) {
    let cart;
    try {
      cart = await this.cartService.findCartWithCheck(
        { id: Number(cart_id) },
        req.user.id,
      );
    } catch (e) {
      response.status(e.getStatus()).send({ message: `${e.message}` });
      return;
    }
    response.status(200).send({ cart });
  }
  @Roles(Role.ADMIN)
  @Get('/cart')
  @ApiOperation({
    summary: 'Get all carts',
  })
  @ApiResponse({
    status: 200,
    description: 'All carts successfully found',
  })
  async getAllCarts() {
    return await this.cartService.getAllCarts();
  }

  @Roles(Role.ADMIN)
  @Post('/cart:user_id')
  @ApiOperation({
    summary: 'Create cart',
  })
  @ApiResponse({
    status: 200,
    description: 'Cart successfully created',
  })
  async createCart(@Param('user_id') user_id: number) {
    return await this.cartService.createCart({ id: Number(user_id) });
  }

  @Roles(Role.ADMIN, Role.USER)
  @Post('/cart:cart_id/add_mattress_by_id:mattress_id')
  @ApiOperation({
    summary: 'Add mattress to cart',
  })
  @ApiResponse({
    status: 200,
    description: 'Mattress successfully added',
  })
  async addMattressToCartById(
    @Param('cart_id') cart_id: number,
    @Param('mattress_id') mattress_id: number,
    @Req() req,
    @Res() response: Response,
  ) {
    cart_id = Number(cart_id);
    mattress_id = Number(mattress_id);
    let cart_mattress;
    try {
      cart_mattress = await this.cartService.addMattressToCartById(
        {
          mattress_id_cart_id: { mattress_id, cart_id },
        },
        req.user.id,
      );
    } catch (e) {
      response.status(e.getStatus()).send({ message: `${e.message}` });
      return;
    }
    response.status(HttpStatus.OK).send({ cart_mattress });
  }

  @Roles(Role.ADMIN, Role.USER)
  @Post('/cart:user_id/add_mattress_by_name:mattress_name')
  @ApiOperation({
    summary: 'Add mattress to cart',
  })
  @ApiResponse({
    status: 200,
    description: 'Mattress successfully added',
  })
  async addMattressToCartByName(
    @Param('user_id') user_id: number,
    @Param('mattress_name') mattress_name: string,
    @Res() response: Response,
    @Req() req,
  ) {
    user_id = Number(user_id);
    mattress_name = String(mattress_name);
    let cart_mattress;
    try {
      cart_mattress = await this.cartService.addMattressToCartByName(
        req.user.id,
        user_id,
        mattress_name,
      );
    } catch (e) {
      response.status(e.getStatus()).send({ message: `${e.message}` });
      return;
    }
    response.status(HttpStatus.OK).send({ cart_mattress });
  }

  @Roles(Role.USER, Role.ADMIN)
  @Delete('/cart:cart_id/delete:mattress_id')
  @ApiOperation({
    summary: 'Delete mattress from cart',
  })
  @ApiResponse({
    status: 200,
    description: 'Cart successfully deleted',
  })
  async deleteMattress(
    @Param('cart_id') cart_id: number,
    @Param('mattress_id') mattress_id: number,
    @Req() req,
    @Res() response: Response,
  ) {
    cart_id = Number(cart_id);
    mattress_id = Number(mattress_id);
    let deleted_mattress;
    try {
      deleted_mattress = await this.cartService.deleteMattress(
        {
          mattress_id_cart_id: { mattress_id, cart_id },
        },
        req.user.id,
      );
    } catch (e) {
      response.status(e.getStatus()).send({ message: `${e.message}` });
    }
    response.status(HttpStatus.OK).send({ deleted_mattress });
  }
}
