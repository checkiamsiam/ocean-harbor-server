"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const authorization_middleware_1 = __importDefault(require("../../middleware/authorization.middleware"));
const queryFeatures_middleware_1 = __importDefault(require("../../middleware/queryFeatures.middleware"));
const notification_controller_1 = __importDefault(require("./notification.controller"));
const notificationRoutes = express_1.default.Router();
notificationRoutes.get("/", (0, authorization_middleware_1.default)(client_1.UserRole.admin, client_1.UserRole.customer), (0, queryFeatures_middleware_1.default)("multiple"), notification_controller_1.default.getNotifications);
notificationRoutes.patch("/read/:id", (0, authorization_middleware_1.default)(client_1.UserRole.admin, client_1.UserRole.customer), notification_controller_1.default.markAsRead);
notificationRoutes.patch("/mark-all-as-read", (0, authorization_middleware_1.default)(client_1.UserRole.admin, client_1.UserRole.customer), notification_controller_1.default.markAllAsRead);
exports.default = notificationRoutes;
