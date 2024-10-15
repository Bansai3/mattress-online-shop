export class MattressInfoDto {
  mattress_id: number;

  user_id: number;

  is_user_authorized: boolean;

  user_login: string;

  type: string;

  recommended: boolean;

  mattress_name: string;

  cost: number;

  manufacture_date: string;

  owner_id: number | null;

  mattress_status: string;

  image_link: string;
}
