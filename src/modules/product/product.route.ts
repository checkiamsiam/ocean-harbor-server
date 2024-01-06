import { UserRole } from "@prisma/client";
import express, { Router } from "express";
import authorization from "../../middleware/authorization.middleware";
import uploadToCloudinary from "../../middleware/fileUpload.middleware";
import queryFeatures from "../../middleware/queryFeatures.middleware";
import productController from "./product.controller";
import validateRequest from "../../middleware/validateRequest.middleware";
import productValidation from "./product.validation";

const productRoutes: Router = express.Router();

productRoutes.post(
  "/create",
  authorization(UserRole.admin),
  uploadToCloudinary("image", "product", [
    "image/jpeg",
    "image/jpg",
    "image/png",
  ]),
  productController.createProduct
);

productRoutes.post(
  "/bulk-create",
  authorization(UserRole.admin),
  validateRequest(productValidation.bulkCreate),
  productController.bulkCreate
);

productRoutes.get(
  "/",
  queryFeatures("multiple"),
  productController.getCategories
);

productRoutes.get(
  "/:id",
  queryFeatures("single"),
  productController.getSingleProduct
);

productRoutes.patch(
  "/update/:id",
  authorization(UserRole.admin),
  uploadToCloudinary("image", "product", [
    "image/jpeg",
    "image/jpg",
    "image/png",
  ]),
  productController.update
);

productRoutes.delete(
  "/delete/:id",
  authorization(UserRole.admin),
  productController.deleteProduct
);

export default productRoutes;
