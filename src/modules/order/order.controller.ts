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
    const statusParam = req.params.status;

    const statusArray = statusParam.split(",") as OrderStatus[];

    const isValid = statusArray.every((str) =>
      Object.values(OrderStatus).includes(str)
    );

    if (!isValid) {
      throw new AppError("Invalid Status", httpStatus.BAD_REQUEST);
    }

    const getResult = await orderService.getOrders(
      statusArray as OrderStatus[],
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
    const statusParam = req.params.status;

    const statusArray = statusParam.split(",") as OrderStatus[];

    const isValid = statusArray.every((str) =>
      Object.values(OrderStatus).includes(str)
    );

    if (!isValid) {
      throw new AppError("Invalid Status", httpStatus.BAD_REQUEST);
    }

    const getResult = await orderService.getMyOrders(
      statusArray as OrderStatus[],
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

const quotationApprove: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
      throw new AppError(
        "Quotation File isn't Upload Properly",
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
    const result = await orderService.quotationApprove(
      req.params.id,
      file.path
    );

    sendResponse<Order>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Quotation Approve successfully",
      data: result,
    });
  }
);

const updateOrderStatus: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const result = await orderService.updateOrderStatus(
      req.params.id,
      req.body
    );

    sendResponse<Order>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Order status update successfully",
      data: result,
    });
  }
);

const confirmOrder: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const result = await orderService.confirmOrDeclineOrder(
      req.params.id,
      req.user.userId,
      OrderStatus.ordered
    );

    sendResponse<Order>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Order Confirm successfully",
      data: result,
    });
  }
);

const declineOrder: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const result = await orderService.confirmOrDeclineOrder(
      req.params.id,
      req.user.userId,
      OrderStatus.declined
    );

    sendResponse<Order>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Order Decline successfully",
      data: result,
    });
  }
);

const invoiceUpload: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
      throw new AppError(
        "Invoice File isn't Upload Properly",
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
    const result = await orderService.invoiceUpload(req.params.id, file.path);

    sendResponse<Order>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Invoice Added successfully",
      data: result,
    });
  }
);

const orderController = {
  requestQuotation,
  getOrders,
  getMyOrders,
  getSingleOrder,
  quotationApprove,
  updateOrderStatus,
  confirmOrder,
  declineOrder,
  invoiceUpload,
};
export default orderController;
