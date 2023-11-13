import express from "express";
import validateRequest from "../../middleware/validateRequest.middleware";
import authController from "./auth.controller";
import authValidation from "./auth.validation";
const authRoutes = express.Router();

authRoutes.post(
  "/login",
  validateRequest(authValidation.loginReq),
  authController.login
);

export default authRoutes;
