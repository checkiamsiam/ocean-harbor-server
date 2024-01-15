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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const catchAsyncError_util_1 = __importDefault(require("../../utils/catchAsyncError.util"));
const customError_util_1 = __importDefault(require("../../utils/customError.util"));
const sendResponse_util_1 = __importDefault(require("../../utils/sendResponse.util"));
const user_service_1 = __importDefault(require("./user.service"));
const profile = (0, catchAsyncError_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.default.profile(req.user);
    (0, sendResponse_util_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Profile get successfully",
        data: result,
    });
}));
const createCustomer = (0, catchAsyncError_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { password, email } = _a, customerData = __rest(_a, ["password", "email"]);
    const username = email.split("@")[0] +
        Math.floor(Math.random() * 10) +
        Math.floor(Math.random() * 10);
    const userData = { password, email, username };
    const result = yield user_service_1.default.createCustomer(customerData, userData);
    (0, sendResponse_util_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "customer created successfully",
        data: result,
    });
}));
const createAdmin = (0, catchAsyncError_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _b = req.body, { password, email } = _b, adminData = __rest(_b, ["password", "email"]);
    const username = email.split("@")[0] +
        Math.floor(Math.random() * 10) +
        Math.floor(Math.random() * 10);
    const userData = { password, email, username, role: client_1.UserRole.admin };
    const result = yield user_service_1.default.createAdmin(adminData, userData);
    (0, sendResponse_util_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Admin created successfully",
        data: result,
    });
}));
const getCustomers = (0, catchAsyncError_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getResult = yield user_service_1.default.getCustomers(req.queryFeatures);
    (0, sendResponse_util_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        data: getResult.data,
        meta: {
            page: req.queryFeatures.page,
            limit: req.queryFeatures.limit,
            total: getResult.total || 0,
        },
    });
}));
const getSingleCustomer = (0, catchAsyncError_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield user_service_1.default.getSingleCustomer(id, req.queryFeatures);
    if (!result) {
        throw new customError_util_1.default("Customer Not Found", http_status_1.default.NOT_FOUND);
    }
    (0, sendResponse_util_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        data: result,
    });
}));
const getAdmins = (0, catchAsyncError_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getResult = yield user_service_1.default.getAdmins(req.queryFeatures);
    (0, sendResponse_util_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        data: getResult.data,
        meta: {
            page: req.queryFeatures.page,
            limit: req.queryFeatures.limit,
            total: getResult.total || 0,
        },
    });
}));
const updateCustomer = (0, catchAsyncError_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customerId = req.params.id;
    const _c = req.body, { password, email } = _c, adminData = __rest(_c, ["password", "email"]);
    const userData = {};
    if (password) {
        userData.password = password;
    }
    if (email) {
        userData.email = email;
    }
    const result = yield user_service_1.default.updateCustomer(customerId, adminData, userData);
    (0, sendResponse_util_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Customer updated successfully",
        data: result,
    });
}));
const userController = {
    createCustomer,
    createAdmin,
    profile,
    getCustomers,
    getAdmins,
    updateCustomer,
    getSingleCustomer,
};
exports.default = userController;
