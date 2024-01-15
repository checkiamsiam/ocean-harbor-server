import { Admin, Customer, User, UserRole } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import catchAsyncErrors from "../../utils/catchAsyncError.util";
import AppError from "../../utils/customError.util";
import sendResponse from "../../utils/sendResponse.util";
import userService from "./user.service";

const profile: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const result = await userService.profile(req.user);

    sendResponse<User>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Profile get successfully",
      data: result,
    });
  }
);

const createCustomer: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const { password, email, ...customerData } = req.body;
    const username: string =
      email.split("@")[0] +
      Math.floor(Math.random() * 10) +
      Math.floor(Math.random() * 10);
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
    const username: string =
      email.split("@")[0] +
      Math.floor(Math.random() * 10) +
      Math.floor(Math.random() * 10);
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

const getCustomers: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const getResult = await userService.getCustomers(req.queryFeatures);
    sendResponse<Partial<Customer>[]>(res, {
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

const getSingleCustomer: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const result: Partial<Customer> | null =
      await userService.getSingleCustomer(id, req.queryFeatures);
    if (!result) {
      throw new AppError("Customer Not Found", httpStatus.NOT_FOUND);
    }
    sendResponse<Partial<Customer>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: result,
    });
  }
);

const getAdmins: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const getResult = await userService.getAdmins(req.queryFeatures);
    sendResponse<Partial<Admin>[]>(res, {
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

const updateCustomer: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const customerId: string = req.params.id;
    const { password, email, ...adminData } = req.body;
    const userData: Partial<User> = {};
    if (password) {
      userData.password = password;
    }
    if (email) {
      userData.email = email;
    }
    const result = await userService.updateCustomer(
      customerId,
      adminData,
      userData
    );
    sendResponse<Admin>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Customer updated successfully",
      data: result,
    });
  }
);

const userController = {
  createCustomer,
  createAdmin,
  profile,
  getCustomers,
  getAdmins,
  updateCustomer,
  getSingleCustomer,
};

export default userController;
