import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import config from "../config";

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

const makeStorage = (folder: string) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      public_id: async (req, file) => folder + "/" + new Date().getTime(),
    },
  });
};

const uploadToCloudinary = (fieldName: string, folderToUpload: string) => {
  const upload = multer({ storage: makeStorage(folderToUpload) });
  return upload.single(fieldName);
};

export default uploadToCloudinary;
