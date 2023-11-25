import { UserRole } from "@prisma/client";
import express, { Router } from "express";
import authorization from "../../middleware/authorization.middleware";
import queryFeatures from "../../middleware/queryFeatures.middleware";
import validateRequest from "../../middleware/validateRequest.middleware";
import accountReqController from "./accountRequest.controller";
import accountReqValidation from "./accountRequest.validation";

const accountReqRoutes: Router = express.Router();

accountReqRoutes.post(
  "/create",
  validateRequest(accountReqValidation.create),
  accountReqController.create
);

accountReqRoutes.get(
  "/",
  authorization(UserRole.admin),
  queryFeatures("multiple"),
  accountReqController.getAccountRequests
);

accountReqRoutes.get(
  "/:id",
  queryFeatures("single"),
  accountReqController.getSingleAccountRequest
);

accountReqRoutes.patch(
  "/accept/:id",
  authorization(UserRole.admin),
  validateRequest(accountReqValidation.accept),
  accountReqController.acceptAccountRequest
);

accountReqRoutes.delete(
  "/delete/:id",
  authorization(UserRole.admin),
  accountReqController.deleteAccountRequest
);

export default accountReqRoutes;
