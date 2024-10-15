import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from './roles/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from './roles/roles.guard';

@ApiTags('users')
@Controller()
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Roles(Role.ADMIN)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  @Get('/user:user_id')
  @ApiOperation({
    summary: 'Get user by id',
  })
  @ApiParam({ name: 'user_id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'User successfully found',
  })
  async getUser(@Param('user_id') user_id: number) {
    user_id = Number(user_id);
    return await this.userService.findUniqueUser({ id: user_id });
  }

  @Get('/user')
  @ApiOperation({
    summary: 'Get all users',
  })
  @ApiResponse({
    status: 200,
    description: 'All users successfully found',
  })
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Delete('/user:user_id')
  @ApiOperation({
    summary: 'Delete user',
  })
  @ApiParam({ name: 'user_id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'User successfully deleted',
  })
  async deleteUser(@Param('user_id') user_id: number) {
    user_id = Number(user_id);
    return await this.userService.deleteUser({ id: Number(user_id) });
  }
}
