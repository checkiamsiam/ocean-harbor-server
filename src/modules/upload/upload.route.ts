import { UserRole } from "@prisma/client";
import express, { Router } from "express";
import authorization from "../../middleware/authorization.middleware";
import uploadToCloudinary from "../../middleware/fileUpload.middleware";
import uploadController from "./upload.controller";

const uploadRoutes: Router = express.Router();

uploadRoutes.post(
  "/bulk",
  authorization(UserRole.admin),
  uploadToCloudinary(
    "images",
    "bulk",
    ["image/jpeg", "image/jpg", "image/png"],
    true
  ),
  uploadController.bulkUpload
);

export default uploadRoutes;
