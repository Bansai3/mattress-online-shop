import {
  Controller,
  Get,
  Param,
  Render,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TimeInterceptor } from './Interceptors/time.interceptor';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CartService } from './cart/cart.service';
import { UserService } from './user/user.service';
import { OrderService } from './order/order.service';
import { MattressService } from './mattress/mattress.service';
import { MattressNotFoundException } from './mattress/excpetions/mattress_not_found.exception';
import { StatisticsService } from './statistics/statistics.service';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
@UseInterceptors(TimeInterceptor)
@UseGuards(JwtAuthGuard)
export class AppController {
  constructor(
    private readonly cartService: CartService,
    private readonly userService: UserService,
    private readonly orderService: OrderService,
    private readonly mattressService: MattressService,
    private readonly statistics_service: StatisticsService,
  ) {}
  @Get()
  @Render('index')
  async getIndexPage(@Req() req) {
    const authorized = req.user.id != -1;
    return {
      is_user_authorized: authorized,
      user_login: req.user.login,
      user_id: req.user.id,
    };
  }

  @Get('/mattresses_full_info/mattress_info_page:mattress_name')
  @Render('mattresses_full_info/mattress_info_page')
  async getMattressInfo(
    @Param('mattress_name') mattress_name: string,
    @Req() req,
  ) {
    const authorized = req.user.id != -1;
    let mattress;
    let error_status = false;
    let error_message = '';
    try {
      mattress = await this.mattressService.findMattressByName(mattress_name);
      if (mattress == null) {
        throw new MattressNotFoundException(mattress_name);
      }
    } catch (e) {
      error_status = true;
      error_message = e.message;
    }
    return {
      mattress_id: mattress.id,
      user_id: req.user.id,
      is_user_authorized: authorized,
      user_login: req.user.login,
      type: mattress.type,
      recommended: mattress.recommended,
      mattress_name: mattress.name,
      cost: mattress.cost,
      manufacture_date: mattress.manufacture_date.getFullYear(),
      owner_id: mattress.owner_id,
      mattress_status: mattress.status,
      image_link: mattress.image_link,
      error_status: error_status,
      error_message: error_message,
    };
  }

  @Get('/cart/cart_page')
  @Render('cart/cart_page')
  async getCartPage(@Req() req) {
    const authorized = req.user.id != -1;
    const mattresses = await this.cartService.getAllCartMattresses({
      id: req.user.id,
    });
    const cart = await this.cartService.findCart({ user_id: req.user.id });
    const cart_id = cart == null ? -1 : cart.id;
    return {
      mattresses: mattresses,
      is_user_authorized: authorized,
      user_login: req.user.login,
      user_id: req.user.id,
      cart_id: cart_id,
    };
  }
  @Get('/profile/profile_page')
  @Render('profile/profile_page')
  async getProfilePage(@Req() req) {
    const authorized = req.user.id != -1;
    if (authorized) {
      const user = await this.userService.findUniqueUser({ id: req.user.id });
      return {
        is_user_authorized: authorized,
        user_fio: user.fio,
        user_email: user.email,
        user_login: req.user.login,
        user_id: req.user.id,
        user_role: user.role,
      };
    }
    return {
      is_user_authorized: authorized,
      user_login: req.user.login,
      user_id: req.user.id,
    };
  }

  @Get('/orders/orders_page')
  @Render('orders/orders_page')
  async getOrdersPage(@Req() req) {
    const authorized = req.user.id != -1;
    const orders = await this.orderService.getUserOrders({
      user_id: req.user.id,
    });
    const orders_mattresses = [];
    for (const order of orders) {
      const mattresses = await this.mattressService.getOrderMattresses({
        id: order.id,
      });
      orders_mattresses.push({ order: order, mattresses: mattresses });
    }
    return {
      orders_mattresses: orders_mattresses,
      is_user_authorized: authorized,
      user_login: req.user.login,
      user_id: req.user.id,
    };
  }

  @Get('/types_of_mattresses_pages/bonel_spring_unit_mattresses_page')
  @Render('types_of_mattresses_pages/bonel_spring_unit_mattresses_page')
  async getBonelSpringUnitMattressesPage(@Req() req) {
    const authorized = req.user.id != -1;
    return {
      is_user_authorized: authorized,
      user_login: req.user.login,
      user_id: req.user.id,
    };
  }

  @Get('/types_of_mattresses_pages/children_mattresses_page')
  @Render('types_of_mattresses_pages/children_mattresses_page')
  async getChildrenMattressesPage(@Req() req) {
    const authorized = req.user.id != -1;
    return {
      is_user_authorized: authorized,
      user_login: req.user.login,
      user_id: req.user.id,
    };
  }

  @Get('/types_of_mattresses_pages/independent_spring_unit_mattresses_page')
  @Render('types_of_mattresses_pages/independent_spring_unit_mattresses_page')
  async getIndependentSpringUnitMattressesPage(@Req() req) {
    const authorized = req.user.id != -1;
    return {
      is_user_authorized: authorized,
      user_login: req.user.login,
      user_id: req.user.id,
    };
  }

  @Get('/types_of_mattresses_pages/major_league_mattresses_page')
  @Render('types_of_mattresses_pages/major_league_mattresses_page')
  async getMajorLeagueMattressesPage(@Req() req) {
    const authorized = req.user.id != -1;
    return {
      is_user_authorized: authorized,
      user_login: req.user.login,
      user_id: req.user.id,
    };
  }

  @Get('/types_of_mattresses_pages/recommended_mattresses_page')
  @Render('types_of_mattresses_pages/recommended_mattresses_page')
  async getRecommendedMattressesPage(@Req() req) {
    const authorized = req.user.id != -1;
    return {
      is_user_authorized: authorized,
      user_login: req.user.login,
      user_id: req.user.id,
    };
  }

  @Get('/types_of_mattresses_pages/springless_mattresses_page')
  @Render('types_of_mattresses_pages/springless_mattresses_page')
  async getSpringlessMattressesPage(@Req() req) {
    const authorized = req.user.id != -1;
    return {
      is_user_authorized: authorized,
      user_login: req.user.login,
      user_id: req.user.id,
    };
  }

  @Get('/registration/registration_page')
  @Render('registration/registration_page')
  async getRegistrationPage(@Req() req) {
    const authorized = req.user.id != -1;
    return {
      register_attempt: true,
      is_user_authorized: authorized,
      user_login: req.user.login,
      user_id: req.user.id,
    };
  }

  @Get('/registration/sign_in_page')
  @Render('registration/sign_in_page')
  async getSignInPage(@Req() req) {
    const authorized = req.user.id != -1;
    return {
      sign_in_attempt: true,
      is_user_authorized: authorized,
      user_login: req.user.login,
      user_id: req.user.id,
    };
  }

  @Get('/form/form')
  @Render('form/form')
  async getFromPage(@Req() req) {
    const authorized = req.user.id != -1;
    return {
      is_user_authorized: authorized,
      user_login: req.user.login,
      user_id: req.user.id,
    };
  }

  @Get('/company_section_pages/about_factory_page')
  @Render('company_section_pages/about_factory_page')
  async getAboutFactoryPage(@Req() req) {
    const authorized = req.user.id != -1;
    return {
      is_user_authorized: authorized,
      user_login: req.user.login,
      user_id: req.user.id,
    };
  }

  @Get('/company_section_pages/info_for_customers_page')
  @Render('company_section_pages/info_for_customers_page')
  async getInfoForCustomersPage(@Req() req) {
    const authorized = req.user.id != -1;
    return {
      is_user_authorized: authorized,
      user_login: req.user.login,
      user_id: req.user.id,
    };
  }

  @Get('/company_section_pages/info_for_partners_page')
  @Render('company_section_pages/info_for_partners_page')
  async getInfoForPartnersPage(@Req() req) {
    const authorized = req.user.id != -1;
    return {
      is_user_authorized: authorized,
      user_login: req.user.login,
      user_id: req.user.id,
    };
  }

  @Get('/company_section_pages/shops_page')
  @Render('company_section_pages/shops_page')
  async getShopPage(@Req() req) {
    const authorized = req.user.id != -1;
    return {
      is_user_authorized: authorized,
      user_login: req.user.login,
      user_id: req.user.id,
    };
  }

  @Get('/statistics')
  @Render('statistics/statistics_page')
  async getStatistics(@Req() req) {
    const statistics = await this.statistics_service.getStatistics();
    const authorized = req.user.id != -1;
    return {
      statistics: statistics,
      is_user_authorized: authorized,
      user_login: req.user.login,
      user_id: req.user.id,
    };
  }
}
