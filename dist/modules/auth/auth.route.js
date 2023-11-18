"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateRequest_middleware_1 = __importDefault(require("../../middleware/validateRequest.middleware"));
const auth_controller_1 = __importDefault(require("./auth.controller"));
const auth_validation_1 = __importDefault(require("./auth.validation"));
const authRoutes = express_1.default.Router();
authRoutes.post("/login", (0, validateRequest_middleware_1.default)(auth_validation_1.default.loginReq), auth_controller_1.default.login);
exports.default = authRoutes;
