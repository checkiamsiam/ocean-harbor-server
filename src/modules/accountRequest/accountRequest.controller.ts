import { AccountRequest } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import catchAsyncErrors from "../../utils/catchAsyncError.util";
import AppError from "../../utils/customError.util";
import sendResponse from "../../utils/sendResponse.util";
import accountReqService from "./accountRequest.service";

const create: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const result = await accountReqService.create(req.body);
    sendResponse<AccountRequest>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "AccountRequest created successfully",
      data: result,
    });
  }
);
const getAccountRequests: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const getResult = await accountReqService.getAccountRequests(
      req.queryFeatures
    );
    sendResponse<Partial<AccountRequest>[]>(res, {
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

const getSingleAccountRequest: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const result: Partial<AccountRequest> | null =
      await accountReqService.getSingleAccountRequest(id, req.queryFeatures);
    if (!result) {
      throw new AppError("AccountRequest Not Found", httpStatus.NOT_FOUND);
    }
    sendResponse<Partial<AccountRequest>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: result,
    });
  }
);

const acceptAccountRequest: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const result: Partial<AccountRequest> | null =
      await accountReqService.acceptAccountRequest(
        req.params.id,
        req.body.password
      );

    if (!result) {
      throw new AppError("Account Request Not Accepted", httpStatus.NOT_FOUND);
    }

    sendResponse<Partial<AccountRequest>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "AccountRequest Accepted",
      data: result,
    });
  }
);

const deleteAccountRequest: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const id: string = req.params.id;

    const result = await accountReqService.deleteAccountRequest(id);

    if (!result) {
      throw new AppError(
        "Requested AccountRequest Not Found",
        httpStatus.NOT_FOUND
      );
    }
    sendResponse<Partial<AccountRequest>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "AccountRequest Deleted Successfully",
    });
  }
);

const accountReqController = {
  create,
  getAccountRequests,
  getSingleAccountRequest,
  acceptAccountRequest,
  deleteAccountRequest,
};
export default accountReqController;
