import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import { NotificationEntity } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { UseGuards } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from '../../auth/guards/graphql-jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@Resolver(() => NotificationEntity)
@UseGuards(GraphqlJwtAuthGuard)
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Mutation(() => NotificationEntity)
  async createNotification(
    @Args('input') input: CreateNotificationDto,
  ) {
    return this.notificationsService.create(input);
  }

  @Query(() => [NotificationEntity])
  async notifications(@CurrentUser() user: { id: string }) {
    return this.notificationsService.findAll(user.id);
  }

  @Query(() => NotificationEntity)
  async notification(
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.notificationsService.findOne(id);
  }

  @Mutation(() => NotificationEntity)
  async updateNotification(
    @Args('input') input: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(input.id, input);
  }

  @Mutation(() => NotificationEntity)
  async markNotificationAsRead(
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.notificationsService.markAsRead(id);
  }

  @Mutation(() => [NotificationEntity])
  async markAllNotificationsAsRead(@CurrentUser() user: { id: string }) {
    return this.notificationsService.markAllAsRead(user.id);
  }

  @Mutation(() => NotificationEntity)
  async removeNotification(
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.notificationsService.remove(id);
  }
} 