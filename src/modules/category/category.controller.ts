import { Category } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import catchAsyncErrors from "../../utils/catchAsyncError.util";
import AppError from "../../utils/customError.util";
import sendResponse from "../../utils/sendResponse.util";
import categoryService from "./category.service";

const createCategory: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
      throw new AppError(
        "Internal Server Error",
        httpStatus.INTERNAL_SERVER_ERROR
      );
    } else {
      req.body.icon = file.path;
    }
    const result = await categoryService.create(req.body);
    sendResponse<Category>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Category created successfully",
      data: result,
    });
  }
);
const getCategories: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const getResult = await categoryService.getCategories(req.queryFeatures);
    sendResponse<Partial<Category>[]>(res, {
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

const getSingleCategory: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const result: Partial<Category> | null =
      await categoryService.getSingleCategory(id, req.queryFeatures);
    if (!result) {
      throw new AppError("Category Not Found", httpStatus.NOT_FOUND);
    }
    sendResponse<Partial<Category>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: result,
    });
  }
);

const update: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const file = req.file;
    if (file) {
      req.body.icon = file.path;
    }
    const updatePayload: Partial<Category> = req.body;

    const result: Partial<Category> | null = await categoryService.update(
      id,
      updatePayload
    );

    if (!result) {
      throw new AppError("Requested Category Not Found", httpStatus.NOT_FOUND);
    }
    sendResponse<Partial<Category>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Category Updated Successfully",
      data: result,
    });
  }
);

const deleteCategory: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const id: string = req.params.id;

    const result = await categoryService.deleteCategory(id);

    if (!result) {
      throw new AppError("Requested Category Not Found", httpStatus.NOT_FOUND);
    }
    sendResponse<Partial<Category>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Category Deleted Successfully",
    });
  }
);

const categoryController = {
  createCategory,
  getCategories,
  getSingleCategory,
  update,
  deleteCategory,
};
export default categoryController;
