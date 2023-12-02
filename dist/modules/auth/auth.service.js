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
exports.authService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const jwt_helper_1 = require("../../helpers/jwt.helper");
const prismaClient_1 = __importDefault(require("../../shared/prismaClient"));
const bcrypt_util_1 = require("../../utils/bcrypt.util");
const customError_util_1 = __importDefault(require("../../utils/customError.util"));
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const isUserExist = yield prismaClient_1.default.user.findUnique({
        where: { email },
    });
    if (!isUserExist) {
        throw new customError_util_1.default("User does not exist", http_status_1.default.NOT_FOUND);
    }
    if (isUserExist.password &&
        !(yield (0, bcrypt_util_1.comparePassword)(password, isUserExist.password))) {
        throw new customError_util_1.default("Password is incorrect", http_status_1.default.UNAUTHORIZED);
    }
    if (isUserExist.role === client_1.UserRole.customer && isUserExist.customerId) {
        const isCustomerExist = yield prismaClient_1.default.customer.findUnique({
            where: { id: isUserExist.customerId },
        });
        if ((isCustomerExist === null || isCustomerExist === void 0 ? void 0 : isCustomerExist.status) === client_1.CustomerStatus.disabled) {
            throw new customError_util_1.default("User is Temporary disabled", http_status_1.default.UNAUTHORIZED);
        }
    }
    const accessToken = jwt_helper_1.jwtHelpers.createToken({
        email: isUserExist.email,
        role: isUserExist.role,
        username: isUserExist.username,
        userId: isUserExist.id,
    }, config_1.default.jwt.secret, config_1.default.jwt.expiresIn);
    return {
        accessToken,
    };
});
exports.authService = {
    loginUser,
};
