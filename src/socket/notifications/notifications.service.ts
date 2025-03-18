import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationEntity } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<NotificationEntity> {
    return this.prisma.notification.create({
      data: createNotificationDto,
      include: {
        user: true,
      },
    });
  }

  async findAll(userId: string): Promise<NotificationEntity[]> {
    return this.prisma.notification.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<NotificationEntity> {
    return this.prisma.notification.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<NotificationEntity> {
    return this.prisma.notification.update({
      where: { id },
      data: updateNotificationDto,
      include: {
        user: true,
      },
    });
  }

  async markAsRead(id: string): Promise<NotificationEntity> {
    return this.prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
      },
      include: {
        user: true,
      },
    });
  }

  async markAllAsRead(userId: string): Promise<NotificationEntity[]> {
    await this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return this.findAll(userId);
  }

  async remove(id: string): Promise<NotificationEntity> {
    return this.prisma.notification.delete({
      where: { id },
      include: {
        user: true,
      },
    });
  }
} 