import { UserRole } from "@prisma/client";
import express, { Router } from "express";
import authorization from "../../middleware/authorization.middleware";
import queryFeatures from "../../middleware/queryFeatures.middleware";
import validateRequest from "../../middleware/validateRequest.middleware";
import userController from "./user.controller";
import userValidations from "./user.validation";

const userRoutes: Router = express.Router();

userRoutes.get(
  "/profile",
  authorization(UserRole.admin, UserRole.customer),
  userController.profile
);

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

userRoutes.get(
  "/get-customers",
  authorization(UserRole.admin),
  queryFeatures("multiple"),
  userController.getCustomers
);

userRoutes.get(
  "/get-single-customer/:id",
  authorization(UserRole.admin),
  queryFeatures("single"),
  userController.getSingleCustomer
);

userRoutes.patch(
  "/update-customer/:id",
  authorization(UserRole.admin),
  validateRequest(userValidations.updateCustomerReq),
  userController.updateCustomer
);

userRoutes.get(
  "/get-admins",
  authorization(UserRole.admin),
  queryFeatures("multiple"),
  userController.getAdmins
);

export default userRoutes;
