import {
  AdminNotificationType,
  CustomerNotificationType,
  Order,
  OrderStatus,
  Prisma,
} from "@prisma/client";
import httpStatus from "http-status";
import {
  IQueryFeatures,
  IQueryResult,
} from "../../interfaces/queryFeatures.interface";
import prisma from "../../shared/prismaClient";
import AppError from "../../utils/customError.util";

const requestQuotation = async (
  authUserId: string,
  items: { productId: string; quantity: number }[]
): Promise<Order> => {
  const result = await prisma.$transaction(async (txc) => {
    const order = await txc.order.create({
      data: {
        customerId: authUserId,
        status: OrderStatus.requestQuotation,
      },
    });

    const orderItemsData = items.map((item) => {
      return {
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
      };
    });

    await txc.orderItem.createMany({
      data: orderItemsData,
    });

    const orderResponse = await txc.order.findUnique({
      where: {
        id: order.id,
      },
      include: {
        _count: true,
        products: true,
        customer: true,
      },
    });

    await txc.adminNotification.create({
      data: {
        message: `New Quotation request from ${orderResponse?.customer?.name}`,
        type: AdminNotificationType.quotationRequest,
        title: "New Quotation request",
        refId: orderResponse?.id,
      },
    });

    return orderResponse;
  });

  if (!result) {
    throw new AppError("Order not created", httpStatus.INTERNAL_SERVER_ERROR);
  }

  return result;
};

const getSingleOrder = async (id: string): Promise<Partial<Order> | null> => {
  const result: Partial<Order> | null = await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      _count: true,
      products: {
        include: {
          product: true,
          order: true,
        },
      },
      customer: true,
    },
  });

  return result;
};

const getOrders = async (
  status: OrderStatus[],
  queryFeatures: IQueryFeatures
): Promise<IQueryResult<Order>> => {
  const whereConditions: Prisma.OrderWhereInput = {
    status: {
      in: status,
    },
  };

  const query: Prisma.OrderFindManyArgs = {
    where: whereConditions,
    skip: queryFeatures.skip || undefined,
    take: queryFeatures.limit || undefined,
    orderBy: queryFeatures.sort,
  };

  if (
    queryFeatures.populate &&
    Object.keys(queryFeatures.populate).length > 0
  ) {
    query.include = {
      _count: true,
      ...queryFeatures.populate,
    };
  } else {
    if (queryFeatures.fields && Object.keys(queryFeatures.fields).length > 0) {
      query.select = { id: true, ...queryFeatures.fields };
    }
  }
  const [result, count] = await prisma.$transaction([
    prisma.order.findMany(query),
    prisma.order.count({ where: whereConditions }),
  ]);

  return {
    data: result,
    total: count,
  };
};

const getMyOrders = async (
  status: OrderStatus[],
  authUserId: string,
  queryFeatures: IQueryFeatures
): Promise<IQueryResult<Order>> => {
  const whereConditions: Prisma.OrderWhereInput = {
    AND: [
      {
        customerId: authUserId,
      },
      {
        status: {
          in: status,
        },
      },
    ],
  };
  const query: Prisma.OrderFindManyArgs = {
    where: whereConditions,
    skip: queryFeatures.skip || undefined,
    take: queryFeatures.limit || undefined,
    orderBy: queryFeatures.sort,
  };

  if (
    queryFeatures.populate &&
    Object.keys(queryFeatures.populate).length > 0
  ) {
    query.include = {
      _count: true,
      ...queryFeatures.populate,
    };
  } else {
    if (queryFeatures.fields && Object.keys(queryFeatures.fields).length > 0) {
      query.select = { id: true, ...queryFeatures.fields };
    }
  }
  const [result, count] = await prisma.$transaction([
    prisma.order.findMany(query),
    prisma.order.count({ where: whereConditions }),
  ]);

  return {
    data: result,
    total: count,
  };
};

const quotationApprove = async (
  id: string,
  quotationFilePath: string
): Promise<Order> => {
  const result = await prisma.$transaction(async (txc) => {
    const order = await txc.order.findUnique({
      where: {
        id,
      },
    });

    if (!order || order.status !== OrderStatus.requestQuotation) {
      throw new AppError(
        "Order you want to approve is not requested yet or already approved",
        httpStatus.NOT_FOUND
      );
    }

    const orderResponse = await txc.order.update({
      where: {
        id,
      },
      data: {
        status: OrderStatus.quotationApproved,
        quotation: quotationFilePath,
      },
      include: {
        _count: true,
        products: true,
      },
    });

    await txc.customerNotification.create({
      data: {
        message: `Your quotation request is approved by admin`,
        type: CustomerNotificationType.quotationApproved,
        title: "Quotation request approved",
        refId: orderResponse?.id,
        customerId: orderResponse?.customerId,
      },
    });

    return orderResponse;
  });

  if (!result) {
    throw new AppError("Order not updated", httpStatus.INTERNAL_SERVER_ERROR);
  }

  return result;
};

const updateOrderStatus = async (
  id: string,
  payload: Partial<Order>
): Promise<Order> => {
  const result = await prisma.$transaction(async (txc) => {
    const orderResponse = await txc.order.update({
      where: {
        id,
      },
      data: payload,
      include: {
        _count: true,
        products: true,
      },
    });

    if (payload.status === OrderStatus.spam) {
      await txc.customerNotification.create({
        data: {
          message: `Your Quotation is declined by admin`,
          type: CustomerNotificationType.quotationDeclined,
          title: "Quotation Request declined",
          refId: orderResponse?.id,
          customerId: orderResponse?.customerId,
        },
      });
    }

    return orderResponse;
  });

  if (!result) {
    throw new AppError("Order not updated", httpStatus.INTERNAL_SERVER_ERROR);
  }

  return result;
};

const confirmOrDeclineOrder = async (
  id: string,
  authUserId: string,
  status: OrderStatus
): Promise<Order> => {
  const result = await prisma.$transaction(async (txc) => {
    const order = await txc.order.findUnique({
      where: {
        id,
      },
    });

    if (
      !order ||
      order.status !== OrderStatus.quotationApproved ||
      order.customerId !== authUserId
    ) {
      throw new AppError(
        "Order you want to confirm/decline is not approved yet or already confirm or its to her/his order",
        httpStatus.NOT_FOUND
      );
    }

    const orderResponse = await txc.order.update({
      where: {
        id,
      },
      data: {
        status: status,
      },
      include: {
        _count: true,
        products: true,
        customer: true,
      },
    });

    if (status === OrderStatus.ordered) {
      await txc.adminNotification.create({
        data: {
          message: `${orderResponse?.customer?.name} confirmed the order For Order Id: ${orderResponse?.id}`,
          type: AdminNotificationType.confirmOrder,
          title: "Order confirmed",
          refId: orderResponse?.id,
        },
      });
    }

    if (status === OrderStatus.declined) {
      await txc.adminNotification.create({
        data: {
          message: `${orderResponse?.customer?.name} declined the order For Order Id: ${orderResponse?.id}`,
          type: AdminNotificationType.declineOrder,
          title: "Order declined",
          refId: orderResponse?.id,
        },
      });
    }

    return orderResponse;
  });

  if (!result) {
    throw new AppError("Order not updated", httpStatus.INTERNAL_SERVER_ERROR);
  }

  return result;
};

const invoiceUpload = async (
  id: string,
  invoiceFilePath: string
): Promise<Order> => {
  const result = await prisma.$transaction(async (txc) => {
    const order = await txc.order.findUnique({
      where: {
        id,
      },
    });

    if (!order || order.status !== OrderStatus.ordered) {
      throw new AppError(
        "Order you want to approve is not requested yet or already approved",
        httpStatus.NOT_FOUND
      );
    }

    const orderResponse = await txc.order.update({
      where: {
        id,
      },
      data: {
        status: OrderStatus.orderInProcess,
        invoice: invoiceFilePath,
      },
      include: {
        _count: true,
        products: true,
      },
    });

    await txc.customerNotification.create({
      data: {
        message: `Admin uploaded invoice for your order`,
        type: CustomerNotificationType.invoiceAdded,
        title: "Invoice Added",
        refId: orderResponse?.id,
        customerId: orderResponse?.customerId,
      },
    });

    return orderResponse;
  });

  if (!result) {
    throw new AppError("Order not updated", httpStatus.INTERNAL_SERVER_ERROR);
  }

  return result;
};

const makeUnConfirmedOrderToSpamStatus = async () => {
  try {
    const currentDate = new Date();
    const fourteenDaysAgo = new Date(currentDate.getTime() - 1209600000); // 14 days in milliseconds
    await prisma.order.updateMany({
      where: {
        AND: [
          { status: OrderStatus.quotationApproved },
          {
            createdAt: {
              lt: fourteenDaysAgo,
            },
          },
        ],
      },
      data: {
        status: OrderStatus.spam,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const orderService = {
  requestQuotation,
  getOrders,
  getMyOrders,
  getSingleOrder,
  quotationApprove,
  confirmOrDeclineOrder,
  updateOrderStatus,
  invoiceUpload,
  makeUnConfirmedOrderToSpamStatus,
};

export default orderService;
