import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    notifications: async () => {
      return await prisma.notification.findMany();
    },
    notification: async (_: any, { id }: { id: string }) => {
      return await prisma.notification.findUnique({
        where: { id },
      });
    },
  },
  Mutation: {
    createNotification: async (_: any, { title, content, url, userId }: { title: string, content: string, url: string, userId: string }) => {
      return await prisma.notification.create({
        data: {
          title,
          content,
          url,
          userId,
        },
      });
    },
    updateNotification: async (_: any, { id, title, content, url, isRead }: { id: string, title: string, content: string, url: string, isRead: boolean }) => {
      return await prisma.notification.update({
        where: { id },
        data: {
          title,
          content,
          url,
          isRead,
        },
      });
    },
    deleteNotification: async (_: any, { id }: { id: string }) => {
      return await prisma.notification.delete({
        where: { id },
      });
    },
  },
  Notification: {
    user: async (parent: any) => {
      return await prisma.user.findUnique({
        where: { id: parent.userId },
      });
    },
  },
};