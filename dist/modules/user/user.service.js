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
const prismaClient_1 = __importDefault(require("../../shared/prismaClient"));
const bcrypt_util_1 = require("../../utils/bcrypt.util");
const createCustomer = (customerData, user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prismaClient_1.default.$transaction((txc) => __awaiter(void 0, void 0, void 0, function* () {
        const customer = yield txc.customer.create({
            data: customerData,
        });
        user.password = yield (0, bcrypt_util_1.hashPassword)(user.password);
        yield txc.user.create({
            data: Object.assign(Object.assign({}, user), { id: customer.id, customerId: customer.id }),
        });
        return customer;
    }));
    return result;
});
const createAdmin = (adminData, user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prismaClient_1.default.$transaction((txc) => __awaiter(void 0, void 0, void 0, function* () {
        const admin = yield txc.admin.create({
            data: adminData,
        });
        user.password = yield (0, bcrypt_util_1.hashPassword)(user.password);
        yield txc.user.create({
            data: Object.assign(Object.assign({}, user), { id: admin.id, adminId: admin.id }),
        });
        return admin;
    }));
    return result;
});
const userService = {
    createCustomer,
    createAdmin,
};
exports.default = userService;
