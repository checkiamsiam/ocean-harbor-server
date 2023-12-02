"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const authorization_middleware_1 = __importDefault(require("../../middleware/authorization.middleware"));
const queryFeatures_middleware_1 = __importDefault(require("../../middleware/queryFeatures.middleware"));
const validateRequest_middleware_1 = __importDefault(require("../../middleware/validateRequest.middleware"));
const accountRequest_controller_1 = __importDefault(require("./accountRequest.controller"));
const accountRequest_validation_1 = __importDefault(require("./accountRequest.validation"));
const accountReqRoutes = express_1.default.Router();
accountReqRoutes.post("/create", (0, validateRequest_middleware_1.default)(accountRequest_validation_1.default.create), accountRequest_controller_1.default.create);
accountReqRoutes.get("/", (0, authorization_middleware_1.default)(client_1.UserRole.admin), (0, queryFeatures_middleware_1.default)("multiple"), accountRequest_controller_1.default.getAccountRequests);
accountReqRoutes.get("/:id", (0, queryFeatures_middleware_1.default)("single"), accountRequest_controller_1.default.getSingleAccountRequest);
accountReqRoutes.patch("/accept/:id", (0, authorization_middleware_1.default)(client_1.UserRole.admin), (0, validateRequest_middleware_1.default)(accountRequest_validation_1.default.accept), accountRequest_controller_1.default.acceptAccountRequest);
accountReqRoutes.delete("/delete/:id", (0, authorization_middleware_1.default)(client_1.UserRole.admin), accountRequest_controller_1.default.deleteAccountRequest);
exports.default = accountReqRoutes;
