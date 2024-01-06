"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const authorization_middleware_1 = __importDefault(require("../../middleware/authorization.middleware"));
const fileUpload_middleware_1 = __importDefault(require("../../middleware/fileUpload.middleware"));
const upload_controller_1 = __importDefault(require("./upload.controller"));
const uploadRoutes = express_1.default.Router();
uploadRoutes.post("/bulk", (0, authorization_middleware_1.default)(client_1.UserRole.admin), (0, fileUpload_middleware_1.default)("images", "bulk", ["image/jpeg", "image/jpg", "image/png"], true), upload_controller_1.default.bulkUpload);
exports.default = uploadRoutes;
