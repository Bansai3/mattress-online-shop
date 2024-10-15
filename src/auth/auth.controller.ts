import {
  Body,
  Controller,
  Get, HttpException, HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { SignInDto } from './dto/sign_in.dto';
import { JwtService } from '@nestjs/jwt';
import { Roles } from '../user/roles/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../user/roles/roles.guard';
import { Role } from '@prisma/client';
import { SignInException } from './exceptions/sign_in.exception';

@Controller('auth')
@ApiTags('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign_in')
  @ApiOperation({
    summary: 'Sign in',
  })
  @ApiResponse({
    status: 200,
    description: 'Signed in successfully',
  })
  async signIn(
    @Body() signInDto: SignInDto,
    @Req() req,
    @Res() response,
  ) {
    const user = await this.authService.validateUser(
      signInDto.login,
      signInDto.password,
    );
    if (user) {
      const sign_in_info = await this.authService.login({
        id: user.id,
        login: user.login,
      });
      response.cookie('user_token', sign_in_info.access_token, {
        expires: new Date(Date.now() + 3600000),
      });
    }
    const sign_in_attempt = user != null;
    const authorized = req.user.id != -1;
    try {
      if (!sign_in_attempt) {
        throw new SignInException('Invalid login or password!');
      }
    } catch (e) {
      response.status(e.getStatus()).send({ message: `${e.message}` });
      return;
    }
    const sign_in_response = {
      is_user_authorized: authorized,
      user_login: req.user.login,
      user_id: req.user.id,
    };
    response.status(HttpStatus.OK).send({ sign_in_response });
  }

  @Post('/register')
  @ApiOperation({
    summary: 'Register',
  })
  @ApiResponse({
    status: 200,
    description: 'Registered successfully',
  })
  async register(
    @Body() registerDto: RegisterDto,
    @Req() req,
    @Res() response,
  ) {
    const authorized = req.user.id != -1;
    try {
      await this.authService.register(registerDto);
    } catch (e) {
      response.status(e.getStatus()).send({ message: `${e.message}` });
      return;
    }
    const register_response = {
      is_user_authorized: authorized,
      user_login: req.user.login,
      user_id: req.user.id,
    };
    response.status(HttpStatus.OK).send({ register_response });
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Put('/logout:user_id')
  @ApiOperation({
    summary: 'Log out',
  })
  @ApiResponse({
    status: 200,
    description: 'Logged out successfully',
  })
  async logout(@Param('user_id') user_id: number, @Res() response, @Req() req) {
    response.cookie('user_token', '', { expires: new Date(Date.now()) });
    try {
      await this.authService.logout({ id: Number(user_id) }, req.user.id);
    } catch (e) {
      response.status(e.getStatus()).send({ message: `${e.message}` });
    }
    response.status(HttpStatus.OK).send();
  }
}
