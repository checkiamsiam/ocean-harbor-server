import { UserRole } from "@prisma/client";
import express, { Router } from "express";
import authorization from "../../middleware/authorization.middleware";
import queryFeatures from "../../middleware/queryFeatures.middleware";
import accountReqController from "./accountRequest.controller";

const accountReqRoutes: Router = express.Router();

accountReqRoutes.post(
  "/create",
  authorization(UserRole.customer),
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
  accountReqController.acceptAccountRequest
);

accountReqRoutes.delete(
  "/delete/:id",
  authorization(UserRole.admin),
  accountReqController.deleteAccountRequest
);

export default accountReqRoutes;
