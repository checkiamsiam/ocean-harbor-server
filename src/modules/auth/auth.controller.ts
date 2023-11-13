import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import catchAsyncErrors from "../../utils/catchAsyncError.util";
import sendResponse from "../../utils/sendResponse.util";
import { ILoginUserResponse } from "./auth.interface";
import { authService } from "./auth.service";

const login: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const result: ILoginUserResponse = await authService.loginUser(req.body);

    sendResponse<ILoginUserResponse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User logged in successfully !",
      data: result,
    });
  }
);

const authController = { login };

export default authController;
