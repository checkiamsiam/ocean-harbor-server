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
const category_controller_1 = __importDefault(require("./category.controller"));
const categoryRoutes = express_1.default.Router();
categoryRoutes.post("/create", (0, authorization_middleware_1.default)(client_1.UserRole.admin), (0, fileUpload_middleware_1.default)("icon", "category", [
    "image/jpeg",
    "image/jpg",
    "image/png",
]), category_controller_1.default.createCategory);
categoryRoutes.get("/", (0, queryFeatures_middleware_1.default)("multiple"), category_controller_1.default.getCategories);
categoryRoutes.get("/:id", (0, queryFeatures_middleware_1.default)("single"), category_controller_1.default.getSingleCategory);
categoryRoutes.patch("/update/:id", (0, authorization_middleware_1.default)(client_1.UserRole.admin), (0, fileUpload_middleware_1.default)("icon", "category", [
    "image/jpeg",
    "image/jpg",
    "image/png",
]), category_controller_1.default.update);
categoryRoutes.delete("/delete/:id", (0, authorization_middleware_1.default)(client_1.UserRole.admin), category_controller_1.default.deleteCategory);
exports.default = categoryRoutes;
