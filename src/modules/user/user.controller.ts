import { Admin, Customer, User, UserRole } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import catchAsyncErrors from "../../utils/catchAsyncError.util";
import sendResponse from "../../utils/sendResponse.util";
import userService from "./user.service";

const createCustomer: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const { password, email, ...customerData } = req.body;
    const username: string = email.split("@")[0];
    const userData = { password, email, username };
    const result = await userService.createCustomer(
      customerData,
      userData as User
    );
    sendResponse<Customer>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "customer created successfully",
      data: result,
    });
  }
);
const createAdmin: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const { password, email, ...adminData } = req.body;
    const username: string = email.split("@")[0];
    const userData = { password, email, username, role: UserRole.admin };
    const result = await userService.createAdmin(adminData, userData as User);
    sendResponse<Admin>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin created successfully",
      data: result,
    });
  }
);

const userController = { createCustomer, createAdmin };

export default userController;
