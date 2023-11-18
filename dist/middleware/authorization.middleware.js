"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config"));
const jwt_helper_1 = require("../helpers/jwt.helper");
const customError_util_1 = __importDefault(require("../utils/customError.util"));
const authorization = (...roles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        else if ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) {
            token = req.cookies.accessToken;
        }
        else {
            token = req.headers.authorization;
        }
        if (!token) {
            throw new customError_util_1.default("You are not authorized", http_status_1.default.UNAUTHORIZED);
        }
        const decoded = jwt_helper_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
        req.user = decoded;
        if (roles.length > 0 && !roles.includes(decoded.role)) {
            throw new customError_util_1.default("Forbidden Access", http_status_1.default.FORBIDDEN);
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.default = authorization;
