import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MattressService } from './mattress.service';
import { Role, Status } from '@prisma/client';
import { MattressDataDto } from './dto/mattress.data.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../user/roles/roles.decorator';
import { RolesGuard } from '../user/roles/roles.guard';
import { Response } from 'express';
import { MattressNotFoundException } from './excpetions/mattress_not_found.exception';
import { UpdateMattressDto } from './dto/update.mattress.dto';
import { io, Socket } from 'socket.io-client';
import { ConfigService } from '@nestjs/config';
import { WebsocketChangeMattressDto } from '../websockets/websocket.change.mattress.dto';

@ApiTags('mattresses')
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class MattressController {
  constructor(
    private readonly mattressService: MattressService,
    @Inject('SOCKET_IO') private socket: Socket,
  ) {
    const configService = new ConfigService();
    this.socket = io(`${configService.get('REF')}`);
    this.socket.on('connect', () => {});
  }

  @Get('/mattress_by_id:mattress_id')
  @ApiOperation({
    summary: 'Get mattress by id',
  })
  @ApiParam({ name: 'mattress_id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Mattress successfully found',
  })
  async getMattressById(
    @Param('mattress_id') mattress_id: number,
    @Req() req,
    @Res() response: Response,
  ) {
    let mattress;
    try {
      mattress = await this.mattressService.findMattressById({
        id: Number(mattress_id),
      });
      if (mattress == null) {
        throw new MattressNotFoundException(mattress_id);
      }
    } catch (e) {
      response.status(e.getStatus()).send({ message: `${e.message}` });
      return;
    }
    response.status(200).send({ mattress });
  }

  @Get('/mattress_by_name:mattress_name')
  @ApiOperation({
    summary: 'Get mattress by name',
  })
  @ApiParam({ name: 'mattress_name', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Mattress successfully found',
  })
  async getMattressByName(
    @Param('mattress_name') mattress_name: string,
    @Req() req,
    @Res() response: Response,
  ) {
    let mattress;
    try {
      mattress = await this.mattressService.findMattressByName(mattress_name);
      if (mattress == null) {
        throw new MattressNotFoundException(mattress_name);
      }
    } catch (e) {
      response.status(e.getStatus()).send({ message: `${e.message}` });
      return;
    }
    response.status(200).send({ mattress });
  }

  @Get('/mattress')
  @ApiOperation({
    summary: 'Get all mattresses',
  })
  @ApiResponse({
    status: 200,
    description: 'All mattresses successfully found',
  })
  async getAllMattresses() {
    return this.mattressService.getAllMattresses();
  }
  @Roles(Role.ADMIN)
  @Post('/mattress')
  @ApiOperation({
    summary: 'Create mattress',
  })
  @ApiResponse({
    status: 200,
    description: 'Mattress successfully created',
  })
  async createMattress(
    @Body()
    mattressData: MattressDataDto,
  ) {
    return await this.mattressService.createMattress({
      type: mattressData.type,
      recommended: mattressData.recommended,
      name: mattressData.name,
      cost: mattressData.cost,
      image_link: mattressData.image_link,
      manufacture_date: new Date(mattressData.manufacture_date),
      status: Status.AVAILABLE,
    });
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('/mattress:mattress_id')
  @ApiOperation({
    summary: 'Delete mattress',
  })
  @ApiParam({ name: 'mattress_id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Mattress successfully deleted',
  })
  async deleteMattress(@Param('mattress_id') mattress_id: number) {
    return await this.mattressService.deleteMattress({
      id: Number(mattress_id),
    });
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('/mattress/update:mattress_id')
  @ApiOperation({
    summary: 'Update mattress',
  })
  @ApiParam({ name: 'mattress_id' })
  @ApiResponse({
    status: 200,
    description: 'Mattress successfully updated',
  })
  async updateMattressCost(
    @Body() update_mattress_cost_dto: UpdateMattressDto,
    @Param('mattress_id') mattress_id: number,
  ) {
    const updated_mattress = await this.mattressService.updateMattressCost(
      update_mattress_cost_dto.cost,
      Number(mattress_id),
    );
    const websocket_dto: WebsocketChangeMattressDto =
      new WebsocketChangeMattressDto();
    websocket_dto.id = mattress_id;
    websocket_dto.field = 'cost';
    websocket_dto.new_value = String(update_mattress_cost_dto.cost);
    this.socket.emit('mattress_change', websocket_dto);
    return updated_mattress;
  }
}
