import {
  AdminNotification,
  CustomerNotification,
  Prisma,
  UserRole,
} from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import {
  IQueryFeatures,
  IQueryResult,
} from "../../interfaces/queryFeatures.interface";
import prisma from "../../shared/prismaClient";

const getNotifications = async (
  user: JwtPayload,
  queryFeatures: IQueryFeatures
): Promise<
  IQueryResult<AdminNotification> | IQueryResult<CustomerNotification>
> => {
  if (user.role === UserRole.admin) {
    const [result, count] = await prisma.$transaction([
      prisma.adminNotification.findMany({
        skip: queryFeatures.skip || undefined,
        take: queryFeatures.limit || undefined,
        orderBy: queryFeatures.sort,
      }),
      prisma.adminNotification.count(),
    ]);

    return {
      data: result,
      total: count,
    };
  } else {
    const whereConditions: Prisma.CustomerNotificationWhereInput = {
      customerId: user.userId,
    };
    const [result, count] = await prisma.$transaction([
      prisma.customerNotification.findMany({
        where: whereConditions,
        skip: queryFeatures.skip || undefined,
        take: queryFeatures.limit || undefined,
        orderBy: queryFeatures.sort,
      }),
      prisma.customerNotification.count({ where: whereConditions }),
    ]);

    return {
      data: result,
      total: count,
    };
  }
};

const markAsRead = async (
  user: JwtPayload,
  id: string
): Promise<AdminNotification | CustomerNotification> => {
  if (user.role === UserRole.admin) {
    const result = await prisma.adminNotification.update({
      where: {
        id: parseInt(id),
      },
      data: {
        read: true,
      },
    });

    return result;
  } else {
    const result = await prisma.customerNotification.update({
      where: {
        customerId: user.userId,
        id: parseInt(id),
      },
      data: {
        read: true,
      },
    });

    return result;
  }
};

const markAllAsRead = async (user: JwtPayload): Promise<void> => {
  if (user.role === UserRole.admin) {
    await prisma.adminNotification.updateMany({
      data: {
        read: true,
      },
    });
  } else {
    await prisma.customerNotification.updateMany({
      where: {
        customerId: user.userId,
      },
      data: {
        read: true,
      },
    });
  }
};

const notificationService = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};

export default notificationService;
