import { UserRole } from "@prisma/client";
import express, { Router } from "express";
import authorization from "../../middleware/authorization.middleware";
import uploadToCloudinary from "../../middleware/fileUpload.middleware";
import queryFeatures from "../../middleware/queryFeatures.middleware";
import categoryController from "./category.controller";

const categoryRoutes: Router = express.Router();

categoryRoutes.post(
  "/create",
  authorization(UserRole.admin),
  uploadToCloudinary("icon", "category", [
    "image/jpeg",
    "image/jpg",
    "image/png",
  ]),
  categoryController.createCategory
);

categoryRoutes.get(
  "/",
  queryFeatures("multiple"),
  categoryController.getCategories
);

categoryRoutes.get(
  "/:id",
  queryFeatures("single"),
  categoryController.getSingleCategory
);

categoryRoutes.patch(
  "/update/:id",
  authorization(UserRole.admin),
  uploadToCloudinary("icon", "category", [
    "image/jpeg",
    "image/jpg",
    "image/png",
  ]),
  categoryController.update
);

categoryRoutes.delete(
  "/delete/:id",
  authorization(UserRole.admin),
  categoryController.deleteCategory
);

export default categoryRoutes;
