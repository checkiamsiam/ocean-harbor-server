import { UserRole } from "@prisma/client";
import express, { Router } from "express";
import authorization from "../../middleware/authorization.middleware";
import uploadToCloudinary from "../../middleware/fileUpload.middleware";
import queryFeatures from "../../middleware/queryFeatures.middleware";
import brandController from "./brand.controller";

const brandRoutes: Router = express.Router();

brandRoutes.post(
  "/create",
  authorization(UserRole.admin),
  uploadToCloudinary("logo", "brand", ["image/jpeg", "image/jpg", "image/png"]),
  brandController.createBrand
);

brandRoutes.get("/", queryFeatures("multiple"), brandController.getBrands);

brandRoutes.get(
  "/:id",
  queryFeatures("single"),
  brandController.getSingleBrand
);

brandRoutes.patch(
  "/update/:id",
  authorization(UserRole.admin),
  uploadToCloudinary("logo", "brand", ["image/jpeg", "image/jpg", "image/png"]),
  brandController.update
);

brandRoutes.delete(
  "/delete/:id",
  authorization(UserRole.admin),
  brandController.deleteBrand
);

export default brandRoutes;
