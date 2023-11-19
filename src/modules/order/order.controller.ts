import { Order, OrderStatus } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import catchAsyncErrors from "../../utils/catchAsyncError.util";
import AppError from "../../utils/customError.util";
import sendResponse from "../../utils/sendResponse.util";
import orderService from "./order.service";

const requestQuotation: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const result = await orderService.requestQuotation(
      req.user.userId,
      req.body.items
    );
    sendResponse<Order>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Request Quotation successfully",
      data: result,
    });
  }
);

const getSingleOrder: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const result: Partial<Order> | null = await orderService.getSingleOrder(id);
    if (!result) {
      throw new AppError("Order Not Found", httpStatus.NOT_FOUND);
    }
    sendResponse<Partial<Order>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: result,
    });
  }
);

const getOrders: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const getResult = await orderService.getOrders(
      req.params.status as OrderStatus,
      req.queryFeatures
    );
    sendResponse<Partial<Order>[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: getResult.data,
      meta: {
        page: req.queryFeatures.page,
        limit: req.queryFeatures.limit,
        total: getResult.total || 0,
      },
    });
  }
);

const getMyOrders: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const getResult = await orderService.getMyOrders(
      req.params.status as OrderStatus,
      req.user.userId,
      req.queryFeatures
    );
    sendResponse<Partial<Order>[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: getResult.data,
      meta: {
        page: req.queryFeatures.page,
        limit: req.queryFeatures.limit,
        total: getResult.total || 0,
      },
    });
  }
);

const orderController = {
  requestQuotation,
  getOrders,
  getMyOrders,
  getSingleOrder,
};
export default orderController;
