import { UserRole } from "@prisma/client";
import express, { Router } from "express";
import authorization from "../../middleware/authorization.middleware";
import queryFeatures from "../../middleware/queryFeatures.middleware";
import notificationController from "./notification.controller";

const notificationRoutes: Router = express.Router();

notificationRoutes.get(
  "/",
  authorization(UserRole.admin, UserRole.customer),
  queryFeatures("multiple"),
  notificationController.getNotifications
);

notificationRoutes.patch(
  "/read/:id",
  authorization(UserRole.admin, UserRole.customer),
  notificationController.markAsRead
);

notificationRoutes.patch(
  "/mark-all-as-read",
  authorization(UserRole.admin, UserRole.customer),
  notificationController.markAllAsRead
);

export default notificationRoutes;
