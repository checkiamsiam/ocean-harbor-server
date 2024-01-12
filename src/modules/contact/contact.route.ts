import express, { Router } from "express";
import validateRequest from "../../middleware/validateRequest.middleware";
import contactController from "./contact.controller";
import contactValidation from "./contact.validation";

const contactReqRoutes: Router = express.Router();

contactReqRoutes.post(
  "/mail",
  validateRequest(contactValidation.sendMail),
  contactController.sendContactMail
);

export default contactReqRoutes;
