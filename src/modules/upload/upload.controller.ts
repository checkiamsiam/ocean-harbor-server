import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import catchAsyncErrors from "../../utils/catchAsyncError.util";
import AppError from "../../utils/customError.util";
import sendResponse from "../../utils/sendResponse.util";

const bulkUpload: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const files = req.files;
    if (!files) {
      throw new AppError(
        "Files isn't Upload Properly",
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }

    sendResponse<any>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Profile get successfully",
      data: files,
    });
  }
);

const uploadController = {
  bulkUpload,
};

export default uploadController;
