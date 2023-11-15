import { SubCategory } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import catchAsyncErrors from "../../utils/catchAsyncError.util";
import AppError from "../../utils/customError.util";
import sendResponse from "../../utils/sendResponse.util";
import subCategoryService from "./subCategory.service";

const createSubCategory: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
      throw new AppError(
        "File isn't Upload Properly",
        httpStatus.INTERNAL_SERVER_ERROR
      );
    } else {
      req.body.icon = file.path;
    }
    const result = await subCategoryService.create(req.body);
    sendResponse<SubCategory>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Sub Category created successfully",
      data: result,
    });
  }
);
const getSubCategories: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const getResult = await subCategoryService.getSubCategories(
      req.queryFeatures
    );
    sendResponse<Partial<SubCategory>[]>(res, {
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

const getSingleSubCategory: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const result: Partial<SubCategory> | null =
      await subCategoryService.getSingleSubCategory(id, req.queryFeatures);
    if (!result) {
      throw new AppError("Sub Category Not Found", httpStatus.NOT_FOUND);
    }
    sendResponse<Partial<SubCategory>>(res, {
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
    const updatePayload: Partial<SubCategory> = req.body;

    const result: Partial<SubCategory> | null = await subCategoryService.update(
      id,
      updatePayload
    );

    if (!result) {
      throw new AppError(
        "Requested Sub Category Not Found",
        httpStatus.NOT_FOUND
      );
    }
    sendResponse<Partial<SubCategory>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Sub Category Updated Successfully",
      data: result,
    });
  }
);

const deleteSubCategory: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const id: string = req.params.id;

    const result = await subCategoryService.deleteSubCategory(id);

    if (!result) {
      throw new AppError(
        "Requested Sub Category Not Found",
        httpStatus.NOT_FOUND
      );
    }
    sendResponse<Partial<SubCategory>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Sub Category Deleted Successfully",
    });
  }
);

const subCategoryController = {
  createSubCategory,
  getSubCategories,
  getSingleSubCategory,
  update,
  deleteSubCategory,
};
export default subCategoryController;
