import { UserRole } from "@prisma/client";
import express, { Router } from "express";
import authorization from "../../middleware/authorization.middleware";
import uploadToCloudinary from "../../middleware/fileUpload.middleware";
import queryFeatures from "../../middleware/queryFeatures.middleware";
import validateRequest from "../../middleware/validateRequest.middleware";
import orderController from "./order.controller";
import orderValidation from "./order.validation";

const orderRoutes: Router = express.Router();

orderRoutes.post(
  "/request-quotation",
  authorization(UserRole.customer),
  validateRequest(orderValidation.requestQuotation),
  orderController.requestQuotation
);

orderRoutes.get(
  "/get-single-order/:id",
  authorization(UserRole.customer, UserRole.admin),
  orderController.getSingleOrder
);

orderRoutes.get(
  "/get-my-orders/:status",
  validateRequest(orderValidation.statusParams),
  authorization(UserRole.customer),
  queryFeatures("multiple"),
  orderController.getMyOrders
);

orderRoutes.get(
  "/:status",
  validateRequest(orderValidation.statusParams),
  authorization(UserRole.admin),
  queryFeatures("multiple"),
  orderController.getOrders
);

orderRoutes.patch(
  "/quotation-approve/:id",
  authorization(UserRole.admin),
  uploadToCloudinary("quotation", "quotations", ["application/pdf"]),
  orderController.quotationApprove
);

orderRoutes.patch(
  "/update/:id",
  authorization(UserRole.admin),
  validateRequest(orderValidation.update),
  orderController.updateOrderStatus
);

orderRoutes.patch(
  "/confirm-order/:id",
  authorization(UserRole.customer),
  orderController.confirmOrder
);

orderRoutes.patch(
  "/add-invoice/:id",
  authorization(UserRole.admin),
  uploadToCloudinary("invoice", "invoices", ["application/pdf"]),
  orderController.invoiceUpload
);

export default orderRoutes;
