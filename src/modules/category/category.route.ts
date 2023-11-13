import express, { Router } from "express";
import uploadToCloudinary from "../../middleware/fileUpload.middleware";
import queryFeatures from "../../middleware/queryFeatures.middleware";
import categoryController from "./category.controller";

const categoryRoutes: Router = express.Router();

categoryRoutes.post(
  "/create",
  // authorization(userRoleEnum.admin),
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
  uploadToCloudinary("icon", "category", [
    "image/jpeg",
    "image/jpg",
    "image/png",
  ]),
  categoryController.update
);

categoryRoutes.delete("/delete/:id", categoryController.deleteCategory);
export default categoryRoutes;
