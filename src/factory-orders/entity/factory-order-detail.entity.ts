import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { OrderStatus, QualityCheckStatus } from '@prisma/client';
import { FactoryOrder } from './factory-order.entity';
import { CheckQuality } from '../../staff-tasks/entity/check-quality.entity';
import { ProductDesignModule } from 'src/product-design/product-design.module';
import { CustomerOrderDetailEntity } from 'src/customer-orders/entities';
import { ProductDesign } from 'src/products/entity/product-design.entity';

registerEnumType(OrderStatus, {
  name: "OrderStatus"
})

registerEnumType(QualityCheckStatus, {
  name: "QualityCheckStatus"
})

@ObjectType()
export class FactoryOrderDetailEntity {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  designId: string;

  @Field(() => ID)
  factoryOrderId: string;

  @Field(() => ID)
  orderDetailId: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Int)
  price: number;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field(() => Int)
  completedQty: number;

  @Field(() => Int)
  rejectedQty: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Field(() => Int)
  productionCost: number;

  @Field(() => QualityCheckStatus, { nullable: true })
  qualityStatus?: QualityCheckStatus;

  @Field(() => Date, { nullable: true })
  qualityCheckedAt?: Date;

  @Field(() => String, { nullable: true })
  qualityCheckedBy?: string;

  @Field(() => FactoryOrder)
  factoryOrder: FactoryOrder;

  @Field(() => ProductDesign)
  design: ProductDesign;

  @Field(() => CustomerOrderDetailEntity)
  orderDetail: CustomerOrderDetailEntity;
} 