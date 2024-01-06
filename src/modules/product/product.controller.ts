import { Product } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import catchAsyncErrors from "../../utils/catchAsyncError.util";
import AppError from "../../utils/customError.util";
import sendResponse from "../../utils/sendResponse.util";
import productService from "./product.service";
import productValidation from "./product.validation";

const createProduct: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
      throw new AppError(
        "File isn't Upload Properly",
        httpStatus.INTERNAL_SERVER_ERROR
      );
    } else {
      req.body.image = file.path;
    }
    await productValidation.create.parseAsync(req.body);
    const result = await productService.create(req.body);
    sendResponse<Product>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Product created successfully",
      data: result,
    });
  }
);
const bulkCreate: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const result = await productService.bulkCreate(req.body);
    sendResponse<Product[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Products created successfully",
      data: result,
    });
  }
);
const getCategories: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const getResult = await productService.getProducts(req.queryFeatures);
    sendResponse<Partial<Product>[]>(res, {
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

const getSingleProduct: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const result: Partial<Product> | null =
      await productService.getSingleProduct(id, req.queryFeatures);
    if (!result) {
      throw new AppError("Product Not Found", httpStatus.NOT_FOUND);
    }
    sendResponse<Partial<Product>>(res, {
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
      req.body.image = file.path;
    }

    await productValidation.update.parseAsync(req.body);

    const result: Partial<Product> | null = await productService.update(
      id,
      req.body
    );

    if (!result) {
      throw new AppError("Requested Product Not Found", httpStatus.NOT_FOUND);
    }
    sendResponse<Partial<Product>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Product Updated Successfully",
      data: result,
    });
  }
);

const deleteProduct: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const id: string = req.params.id;

    const result = await productService.deleteProduct(id);

    if (!result) {
      throw new AppError("Requested Product Not Found", httpStatus.NOT_FOUND);
    }
    sendResponse<Partial<Product>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Product Deleted Successfully",
    });
  }
);

const productController = {
  createProduct,
  getCategories,
  getSingleProduct,
  update,
  deleteProduct,
  bulkCreate,
};
export default productController;
