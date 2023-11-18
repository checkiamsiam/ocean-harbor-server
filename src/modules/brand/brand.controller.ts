import { Brand } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import catchAsyncErrors from "../../utils/catchAsyncError.util";
import AppError from "../../utils/customError.util";
import sendResponse from "../../utils/sendResponse.util";
import brandService from "./brand.service";
import brandValidation from "./brand.validation";

const createBrand: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
      throw new AppError(
        "File isn't Upload Properly",
        httpStatus.INTERNAL_SERVER_ERROR
      );
    } else {
      req.body.logo = file.path;
    }
    await brandValidation.create.parseAsync(req.body);
    const result = await brandService.create(req.body);
    sendResponse<Brand>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Brand created successfully",
      data: result,
    });
  }
);

const getBrands: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const getResult = await brandService.getBrands(req.queryFeatures);
    sendResponse<Partial<Brand>[]>(res, {
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

const getSingleBrand: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const result: Partial<Brand> | null = await brandService.getSingleBrand(
      id,
      req.queryFeatures
    );
    if (!result) {
      throw new AppError("Brand Not Found", httpStatus.NOT_FOUND);
    }
    sendResponse<Partial<Brand>>(res, {
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
      req.body.logo = file.path;
    }

    await brandValidation.update.parseAsync(req.body);

    const result: Partial<Brand> | null = await brandService.update(
      id,
      req.body
    );

    if (!result) {
      throw new AppError("Requested Brand Not Found", httpStatus.NOT_FOUND);
    }
    sendResponse<Partial<Brand>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Brand Updated Successfully",
      data: result,
    });
  }
);

const deleteBrand: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const id: string = req.params.id;

    const result = await brandService.deleteBrand(id);

    if (!result) {
      throw new AppError("Requested Brand Not Found", httpStatus.NOT_FOUND);
    }
    sendResponse<Partial<Brand>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Brand Deleted Successfully",
    });
  }
);

const brandController = {
  createBrand,
  getBrands,
  getSingleBrand,
  update,
  deleteBrand,
};
export default brandController;
