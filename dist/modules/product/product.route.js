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
const product_controller_1 = __importDefault(require("./product.controller"));
const productRoutes = express_1.default.Router();
productRoutes.post("/create", (0, authorization_middleware_1.default)(client_1.UserRole.admin), (0, fileUpload_middleware_1.default)("image", "product", [
    "image/jpeg",
    "image/jpg",
    "image/png",
]), product_controller_1.default.createProduct);
productRoutes.get("/", (0, queryFeatures_middleware_1.default)("multiple"), product_controller_1.default.getCategories);
productRoutes.get("/:id", (0, queryFeatures_middleware_1.default)("single"), product_controller_1.default.getSingleProduct);
productRoutes.patch("/update/:id", (0, authorization_middleware_1.default)(client_1.UserRole.admin), (0, fileUpload_middleware_1.default)("image", "product", [
    "image/jpeg",
    "image/jpg",
    "image/png",
]), product_controller_1.default.update);
productRoutes.delete("/delete/:id", (0, authorization_middleware_1.default)(client_1.UserRole.admin), product_controller_1.default.deleteProduct);
exports.default = productRoutes;
