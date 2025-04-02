import { registerEnumType } from '@nestjs/graphql';

export enum OrderDetailStatus {
  PENDING = 'PENDING',
  IN_PRODUCTION = 'IN_PRODUCTION',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  QUALITY_CHECK_PENDING = 'QUALITY_CHECK_PENDING',
  QUALITY_CHECK_PASSED = 'QUALITY_CHECK_PASSED',
  QUALITY_CHECK_FAILED = 'QUALITY_CHECK_FAILED',
  REWORK_REQUIRED = 'REWORK_REQUIRED',
  REWORK_IN_PROGRESS = 'REWORK_IN_PROGRESS',
  REWORK_COMPLETED = 'REWORK_COMPLETED',
  SHIPPED = 'SHIPPED'
}

registerEnumType(OrderDetailStatus, {
  name: 'OrderDetailStatus',
  description: 'Status of a factory order detail item',
}); 