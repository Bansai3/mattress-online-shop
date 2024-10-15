import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Prisma, Role, Status, UserStatus } from '@prisma/client';
import { SignInDto } from './dto/sign_in.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from '../user/dto/update.user.dto';
import { CartService } from '../cart/cart.service';
import { SignInException } from './exceptions/sign_in.exception';
import { RegisterException } from './exceptions/register.exception';
import { UserNotFoundException } from '../user/exceptions/user_not_found.exception';
import { JwtService } from '@nestjs/jwt';
import { IUser } from './types/types';
import { PrismaService } from '../prisma/prisma.service';
import { JwtTokensService } from '../jwt_tokens/jwt_tokens.service';
import { request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private cartService: CartService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private jwtTokenService: JwtTokensService,
  ) {}

  public async validateUser(login: string, password: string): Promise<any> {
    const input_user: Prisma.userWhereInput = {
      login: login,
    };
    const user = await this.userService.findUser(input_user);
    if (user && user.password == password) {
      const { password, ...result} = user;
      return result;
    }
    return null;
  }

  public async checkUser(login: string, id: number) {
    const user = await this.userService.findUniqueUser({ id: id });
    if (user && user.login == login) {
      return user;
    }
    return null;
  }

  async login(user: IUser) {
    const { id, login } = user;
    const unique_input_user: Prisma.userWhereUniqueInput = { id: user.id };
    const update_user_input: Prisma.userUpdateInput = {
      status: 'AUTHENTICATED',
    };
    await this.prisma.user.update({
      data: update_user_input,
      where: unique_input_user,
    });
    const access_token = this.jwtService.sign({
      id: user.id,
      login: user.login,
    });
    const db_token_value = await this.jwtTokenService.getToken({
      user_id: user.id,
    });
    if (db_token_value) {
      await this.jwtTokenService.updateToken(
        { user_id: user.id },
        access_token,
      );
    } else {
      await this.jwtTokenService.addToken(access_token, { id: user.id });
    }
    return {
      id,
      login,
      access_token: access_token,
    };
  }

  public async signIn(signInDto: SignInDto) {
    const input_user: Prisma.userWhereInput = {
      login: signInDto.login,
    };
    const user = await this.userService.findUser(input_user);
    if (user == null) {
      throw new SignInException('Invalid login!');
    }

    if (user.password != signInDto.password) {
      throw new SignInException('Invalid password!');
    }

    const updateUserDto: UpdateUserDto = new UpdateUserDto();
    updateUserDto.id = user.id;
    updateUserDto.status = UserStatus.AUTHENTICATED;
    updateUserDto.fio = user.fio;
    updateUserDto.email = user.email;
    updateUserDto.role = user.role;

    await this.userService.updateUser(updateUserDto);
    const payload = { sub: user.id, login: user.login };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  public async logout(
    unique_input_user: Prisma.userWhereUniqueInput,
    request_user_id: number,
  ) {
    const user = await this.userService.findUniqueUser(unique_input_user);
    if (user == null) {
      throw new UserNotFoundException(unique_input_user.id);
    }
    if (user.role == Role.USER && request_user_id != unique_input_user.id) {
      throw new UnauthorizedException(
        'Запрещено выходить из аккаунта другого пользователя!',
      );
    }
    await this.jwtTokenService.deleteToken({ user_id: user.id });
    return this.userService.updateUserStatus(
      unique_input_user,
      UserStatus.UNAUTHENTICATED,
    );
  }

  public async register(registerDto: RegisterDto) {
    const input_user: Prisma.userWhereInput = {
      login: registerDto.login,
    };

    const user = await this.userService.findUser(input_user);
    if (user != null) {
      throw new RegisterException(
        `User with login:${registerDto.login} already exists!`,
      );
    }

    const { login, fio, email, password } = registerDto;
    const role = Role.USER;
    const status = UserStatus.UNAUTHENTICATED;
    const data: Prisma.userCreateInput = {
      login,
      fio,
      email,
      password,
      role,
      status,
    };
    const created_user = await this.userService.createUser(data);
    await this.cartService.createCart({ id: created_user.id });
    return created_user;
  }
}
