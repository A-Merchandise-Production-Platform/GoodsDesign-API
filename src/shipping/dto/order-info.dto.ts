import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrderLogDto {
  @Field()
  status: string;

  @Field()
  updated_date: string;
}

@ObjectType()
export class OrderInfoDto {
  @Field()
  shop_id: number;

  @Field()
  client_id: number;

  @Field({ nullable: true })
  return_name: string;

  @Field({ nullable: true })
  return_phone: string;

  @Field({ nullable: true })
  return_address: string;

  @Field({ nullable: true })
  return_ward_code: string;

  @Field({ nullable: true })
  return_district_id: number;

  @Field()
  from_name: string;

  @Field()
  from_phone: string;

  @Field()
  from_address: string;

  @Field()
  from_ward_code: string;

  @Field()
  from_district_id: number;

  @Field({ nullable: true })
  deliver_station_id: number;

  @Field()
  to_name: string;

  @Field()
  to_phone: string;

  @Field()
  to_address: string;

  @Field()
  to_ward_code: string;

  @Field()
  to_district_id: number;

  @Field()
  weight: number;

  @Field()
  length: number;

  @Field()
  width: number;

  @Field()
  height: number;

  @Field()
  converted_weight: number;

  @Field()
  service_type_id: number;

  @Field()
  service_id: number;

  @Field()
  payment_type_id: number;

  @Field()
  custom_service_fee: number;

  @Field()
  cod_amount: number;

  @Field({ nullable: true })
  cod_collect_date: string;

  @Field({ nullable: true })
  cod_transfer_date: string;

  @Field()
  is_cod_transferred: boolean;

  @Field()
  is_cod_collected: boolean;

  @Field()
  insurance_value: number;

  @Field()
  order_value: number;

  @Field({ nullable: true })
  pick_station_id: number;

  @Field({ nullable: true })
  client_order_code: string;

  @Field()
  cod_failed_amount: number;

  @Field({ nullable: true })
  cod_failed_collect_date: string;

  @Field()
  required_note: string;

  @Field()
  content: string;

  @Field({ nullable: true })
  note: string;

  @Field({ nullable: true })
  employee_note: string;

  @Field({ nullable: true })
  coupon: string;

  @Field()
  order_code: string;

  @Field()
  updated_ip: string;

  @Field()
  updated_employee: number;

  @Field()
  updated_client: number;

  @Field()
  updated_source: string;

  @Field()
  updated_date: string;

  @Field()
  updated_warehouse: number;

  @Field()
  created_ip: string;

  @Field()
  created_employee: number;

  @Field()
  created_client: number;

  @Field()
  created_source: string;

  @Field()
  created_date: string;

  @Field()
  status: string;

  @Field()
  pick_warehouse_id: number;

  @Field()
  deliver_warehouse_id: number;

  @Field()
  current_warehouse_id: number;

  @Field()
  return_warehouse_id: number;

  @Field()
  next_warehouse_id: number;

  @Field({ nullable: true })
  leadtime: string;

  @Field()
  order_date: string;

  @Field({ nullable: true })
  finish_date: string;

  @Field(() => [String], { nullable: true })
  tag: string[];

  @Field(() => [OrderLogDto], { nullable: true })
  log: OrderLogDto[];
} 