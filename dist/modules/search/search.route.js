"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const queryFeatures_middleware_1 = __importDefault(require("../../middleware/queryFeatures.middleware"));
const search_controller_1 = __importDefault(require("./search.controller"));
const searchRoutes = express_1.default.Router();
searchRoutes.get("/", (0, queryFeatures_middleware_1.default)("multiple"), search_controller_1.default.globalSearch);
exports.default = searchRoutes;
