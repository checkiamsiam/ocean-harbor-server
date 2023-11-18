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
const subCategory_controller_1 = __importDefault(require("./subCategory.controller"));
const subCategoryRoutes = express_1.default.Router();
subCategoryRoutes.post("/create", (0, authorization_middleware_1.default)(client_1.UserRole.admin), (0, fileUpload_middleware_1.default)("icon", "subCategory", [
    "image/jpeg",
    "image/jpg",
    "image/png",
]), subCategory_controller_1.default.createSubCategory);
subCategoryRoutes.get("/", (0, queryFeatures_middleware_1.default)("multiple"), subCategory_controller_1.default.getSubCategories);
subCategoryRoutes.get("/:id", (0, queryFeatures_middleware_1.default)("single"), subCategory_controller_1.default.getSingleSubCategory);
subCategoryRoutes.patch("/update/:id", (0, authorization_middleware_1.default)(client_1.UserRole.admin), (0, fileUpload_middleware_1.default)("icon", "category", [
    "image/jpeg",
    "image/jpg",
    "image/png",
]), subCategory_controller_1.default.update);
subCategoryRoutes.delete("/delete/:id", (0, authorization_middleware_1.default)(client_1.UserRole.admin), subCategory_controller_1.default.deleteSubCategory);
exports.default = subCategoryRoutes;
