"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateRequest_middleware_1 = __importDefault(require("../../middleware/validateRequest.middleware"));
const contact_controller_1 = __importDefault(require("./contact.controller"));
const contact_validation_1 = __importDefault(require("./contact.validation"));
const contactReqRoutes = express_1.default.Router();
contactReqRoutes.post("/mail", (0, validateRequest_middleware_1.default)(contact_validation_1.default.sendMail), contact_controller_1.default.sendContactMail);
exports.default = contactReqRoutes;
