import { UserRole } from "@prisma/client";
import express, { Router } from "express";
import authorization from "../../middleware/authorization.middleware";
import uploadToCloudinary from "../../middleware/fileUpload.middleware";
import queryFeatures from "../../middleware/queryFeatures.middleware";
import subCategoryController from "./subCategory.controller";

const subCategoryRoutes: Router = express.Router();

subCategoryRoutes.post(
  "/create",
  authorization(UserRole.admin),
  uploadToCloudinary("icon", "subCategory", [
    "image/jpeg",
    "image/jpg",
    "image/png",
  ]),
  subCategoryController.createSubCategory
);

subCategoryRoutes.get(
  "/",
  queryFeatures("multiple"),
  subCategoryController.getSubCategories
);

subCategoryRoutes.get(
  "/:id",
  queryFeatures("single"),
  subCategoryController.getSingleSubCategory
);

subCategoryRoutes.patch(
  "/update/:id",
  authorization(UserRole.admin),
  uploadToCloudinary("icon", "category", [
    "image/jpeg",
    "image/jpg",
    "image/png",
  ]),
  subCategoryController.update
);

subCategoryRoutes.delete(
  "/delete/:id",
  authorization(UserRole.admin),
  subCategoryController.deleteSubCategory
);

export default subCategoryRoutes;
