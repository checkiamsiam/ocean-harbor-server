import { v2 as cloudinary } from "cloudinary";
import httpStatus from "http-status";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import config from "../config";
import AppError from "../utils/customError.util";

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

const makeStorage = (folder: string) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      public_id: () => `GA/${folder}/` + new Date().getTime(),
    },
  });
};

type TmimeTypes = "image/png" | "image/jpeg" | "image/jpg" | "application/pdf";

const uploadToCloudinary = (
  fieldName: string,
  folderToUpload: string,
  fileFilter: TmimeTypes[]
) => {
  const upload = multer({
    storage: makeStorage(folderToUpload),
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: (req, file, cb) => {
      if (fileFilter.includes(file.mimetype as TmimeTypes)) {
        cb(null, true);
      } else {
        cb(new AppError("Invalid File Format", httpStatus.BAD_REQUEST));
      }
    },
  });
  return upload.single(fieldName);
};

export default uploadToCloudinary;
