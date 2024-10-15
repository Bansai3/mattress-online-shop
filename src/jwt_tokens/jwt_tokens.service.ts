import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserNotFoundException } from '../user/exceptions/user_not_found.exception';
import { Prisma } from '@prisma/client';

@Injectable()
export class JwtTokensService {
  constructor(private readonly prisma: PrismaService) {}

  async addToken(
    token: string,
    unique_user_input: Prisma.userWhereUniqueInput,
  ) {
    const user = await this.prisma.user.findUnique({
      where: unique_user_input,
    });
    if (!user) {
      throw new UserNotFoundException(unique_user_input.id);
    }
    const nested_user: Prisma.userCreateNestedOneWithoutTokenInput = {
      connect: unique_user_input,
    };
    const token_create: Prisma.tokenCreateInput = {
      value: token,
      user: nested_user,
    };
    return this.prisma.token.create({ data: token_create });
  }
  async updateToken(
    unique_token_input: Prisma.tokenWhereUniqueInput,
    token_value: string,
  ) {
    const token = await this.prisma.token.findUnique({
      where: unique_token_input,
    });
    if (!token) {
      throw new NotFoundException(
        `Пользователь с id ${unique_token_input.user_id} не имеет jwt токена!`,
      );
    }
    const user_unique_input: Prisma.userWhereUniqueInput = {
      id: unique_token_input.user_id,
    };
    const update_user_without_input: Prisma.userUpdateOneRequiredWithoutTokenNestedInput =
      {
        connect: user_unique_input,
      };
    const update_token: Prisma.tokenUpdateInput = {
      value: token_value,
      user: update_user_without_input,
    };
    return this.prisma.token.update({
      data: update_token,
      where: unique_token_input,
    });
  }

  async getToken(unique_token_input: Prisma.tokenWhereUniqueInput) {
    return this.prisma.token.findUnique({
      where: unique_token_input,
    });
  }

  async deleteToken(unique_token_input: Prisma.tokenWhereUniqueInput) {
    const token = await this.prisma.token.findUnique({
      where: unique_token_input,
    });
    if (!token) {
      throw new NotFoundException(
        `Пользователь с id ${unique_token_input.user_id} не имеет jwt токена!`,
      );
    }
    return this.prisma.token.delete({ where: unique_token_input });
  }
}
