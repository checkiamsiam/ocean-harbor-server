"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const authorization_middleware_1 = __importDefault(require("../../middleware/authorization.middleware"));
const fileUpload_middleware_1 = __importDefault(require("../../middleware/fileUpload.middleware"));
const queryFeatures_middleware_1 = __importDefault(require("../../middleware/queryFeatures.middleware"));
const brand_controller_1 = __importDefault(require("./brand.controller"));
const brandRoutes = express_1.default.Router();
brandRoutes.post("/create", (0, authorization_middleware_1.default)(client_1.UserRole.admin), (0, fileUpload_middleware_1.default)("logo", "brand", ["image/jpeg", "image/jpg", "image/png"]), brand_controller_1.default.createBrand);
brandRoutes.get("/", (0, queryFeatures_middleware_1.default)("multiple"), brand_controller_1.default.getBrands);
brandRoutes.get("/:id", (0, queryFeatures_middleware_1.default)("single"), brand_controller_1.default.getSingleBrand);
brandRoutes.patch("/update/:id", (0, authorization_middleware_1.default)(client_1.UserRole.admin), (0, fileUpload_middleware_1.default)("logo", "brand", ["image/jpeg", "image/jpg", "image/png"]), brand_controller_1.default.update);
brandRoutes.delete("/delete/:id", (0, authorization_middleware_1.default)(client_1.UserRole.admin), brand_controller_1.default.deleteBrand);
exports.default = brandRoutes;
