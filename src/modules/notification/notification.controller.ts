import { AdminNotification, CustomerNotification } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import catchAsyncErrors from "../../utils/catchAsyncError.util";
import sendResponse from "../../utils/sendResponse.util";
import notificationService from "./notification.service";

const getNotifications: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const getResult = await notificationService.getNotifications(
      req.user,
      req.queryFeatures
    );
    sendResponse<
      Partial<AdminNotification>[] | Partial<CustomerNotification>[]
    >(res, {
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

const markAsRead: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const getResult = await notificationService.markAsRead(
      req.user,
      req.params.id
    );
    sendResponse<Partial<AdminNotification> | Partial<CustomerNotification>>(
      res,
      {
        statusCode: httpStatus.OK,
        success: true,
        message: "Notification Marked As Read",
        data: getResult,
      }
    );
  }
);

const markAllAsRead: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    await notificationService.markAllAsRead(req.user);
    sendResponse<Partial<AdminNotification> | Partial<CustomerNotification>>(
      res,
      {
        statusCode: httpStatus.OK,
        success: true,
        message: "Notification Marked All As Read",
      }
    );
  }
);

const notificationController = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};
export default notificationController;
