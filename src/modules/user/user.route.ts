import { UserRole } from "@prisma/client";
import express, { Router } from "express";
import authorization from "../../middleware/authorization.middleware";
import validateRequest from "../../middleware/validateRequest.middleware";
import userController from "./user.controller";
import userValidations from "./user.validation";

const userRoutes: Router = express.Router();

userRoutes.post(
  "/create-customer",
  authorization(UserRole.admin),
  validateRequest(userValidations.createCustomerReq),
  userController.createCustomer
);

userRoutes.post(
  "/create-admin",
  authorization(UserRole.admin),
  validateRequest(userValidations.createAdminReq),
  userController.createAdmin
);

export default userRoutes;
