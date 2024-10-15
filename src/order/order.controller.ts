import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrderService } from '../order/order.service';
import { OrderDetailsDto } from './dto/order.details.dto';
import { CartService } from '../cart/cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';
import { Role, Status } from '@prisma/client';
import { RolesGuard } from '../user/roles/roles.guard';
import { Roles } from '../user/roles/roles.decorator';
import { io, Socket } from 'socket.io-client';
import { ConfigService } from '@nestjs/config';
import { WebsocketChangeMattressDto } from '../websockets/websocket.change.mattress.dto';

@ApiTags('orders')
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly cartService: CartService,
    @Inject('SOCKET_IO') private socket: Socket,
  ) {
    const configService = new ConfigService();
    this.socket = io(`${configService.get('REF')}`);
    this.socket.on('connect', () => {});
  }

  @Roles(Role.USER, Role.ADMIN)
  @Get('/order:order_id')
  @ApiOperation({
    summary: 'Get order by id',
  })
  @ApiParam({ name: 'order_id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Order successfully found',
  })
  async getOrder(
    @Param('order_id') order_id: number,
    @Req() req,
    @Res() response: Response,
  ) {
    order_id = Number(order_id);
    let order;
    try {
      order = await this.orderService.findOrder({ id: order_id }, req.user.id);
    } catch (e) {
      response.status(e.getStatus()).send({ message: `${e.message}` });
      return;
    }
    response.status(HttpStatus.OK).send({ order });
  }

  @Roles(Role.ADMIN)
  @Get('/order')
  @ApiOperation({
    summary: 'Get all orders',
  })
  @ApiResponse({
    status: 200,
    description: 'All orders successfully found',
  })
  async getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @Roles(Role.USER, Role.ADMIN)
  @Post('/order:user_id')
  @ApiOperation({
    summary: 'Create order',
  })
  @ApiParam({ name: 'user_id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Order successfully created',
  })
  async createOrder(
    @Param('user_id') user_id: number,
    @Body() order_details: OrderDetailsDto,
    @Req() req,
    @Res() response: Response,
  ) {
    user_id = Number(user_id);
    let order, mattresses;
    try {
      [order, mattresses] = await this.orderService.createOrder(
        { id: user_id },
        order_details,
        req.user.id,
      );
    } catch (e) {
      response.status(e.getStatus()).send({ message: `${e.message}` });
      return;
    }
    for (const mattress of mattresses) {
      const websocket_dto: WebsocketChangeMattressDto =
        new WebsocketChangeMattressDto();
      websocket_dto.id = mattress.mattress_id;
      websocket_dto.field = 'status';
      websocket_dto.new_value = String(Status.SOLD);
      this.socket.emit('mattress_change', websocket_dto);
    }
    response.status(HttpStatus.OK).send({ order });
  }

  @Roles(Role.ADMIN)
  @Delete('/order:order_id')
  @ApiOperation({
    summary: 'Delete order',
  })
  @ApiParam({ name: 'order_id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Order successfully deleted',
  })
  async deleteOrder(@Param('order_id') order_id: number) {
    order_id = Number(order_id);
    return await this.orderService.deleteOrder({ id: order_id });
  }
}
