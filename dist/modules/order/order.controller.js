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
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const catchAsyncError_util_1 = __importDefault(require("../../utils/catchAsyncError.util"));
const customError_util_1 = __importDefault(require("../../utils/customError.util"));
const sendResponse_util_1 = __importDefault(require("../../utils/sendResponse.util"));
const order_service_1 = __importDefault(require("./order.service"));
const requestQuotation = (0, catchAsyncError_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.default.requestQuotation(req.user.userId, req.body.items);
    (0, sendResponse_util_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Request Quotation successfully",
        data: result,
    });
}));
const getSingleOrder = (0, catchAsyncError_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield order_service_1.default.getSingleOrder(id);
    if (!result) {
        throw new customError_util_1.default("Order Not Found", http_status_1.default.NOT_FOUND);
    }
    (0, sendResponse_util_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        data: result,
    });
}));
const getOrders = (0, catchAsyncError_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const statusParam = req.params.status;
    const statusArray = statusParam.split(",");
    const isValid = statusArray.every((str) => Object.values(client_1.OrderStatus).includes(str));
    if (!isValid) {
        throw new customError_util_1.default("Invalid Status", http_status_1.default.BAD_REQUEST);
    }
    const getResult = yield order_service_1.default.getOrders(statusArray, req.queryFeatures);
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
const getMyOrders = (0, catchAsyncError_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const statusParam = req.params.status;
    const statusArray = statusParam.split(",");
    const isValid = statusArray.every((str) => Object.values(client_1.OrderStatus).includes(str));
    if (!isValid) {
        throw new customError_util_1.default("Invalid Status", http_status_1.default.BAD_REQUEST);
    }
    const getResult = yield order_service_1.default.getMyOrders(statusArray, req.user.userId, req.queryFeatures);
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
const quotationApprove = (0, catchAsyncError_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (!file) {
        throw new customError_util_1.default("Quotation File isn't Upload Properly", http_status_1.default.INTERNAL_SERVER_ERROR);
    }
    const result = yield order_service_1.default.quotationApprove(req.params.id, file.path);
    (0, sendResponse_util_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Quotation Approve successfully",
        data: result,
    });
}));
const updateOrderStatus = (0, catchAsyncError_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.default.updateOrderStatus(req.params.id, req.body);
    (0, sendResponse_util_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Order status update successfully",
        data: result,
    });
}));
const confirmOrder = (0, catchAsyncError_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.default.confirmOrDeclineOrder(req.params.id, req.user.userId, client_1.OrderStatus.ordered);
    (0, sendResponse_util_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Order Confirm successfully",
        data: result,
    });
}));
const declineOrder = (0, catchAsyncError_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.default.confirmOrDeclineOrder(req.params.id, req.user.userId, client_1.OrderStatus.declined);
    (0, sendResponse_util_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Order Decline successfully",
        data: result,
    });
}));
const invoiceUpload = (0, catchAsyncError_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (!file) {
        throw new customError_util_1.default("Invoice File isn't Upload Properly", http_status_1.default.INTERNAL_SERVER_ERROR);
    }
    const result = yield order_service_1.default.invoiceUpload(req.params.id, file.path);
    (0, sendResponse_util_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Invoice Added successfully",
        data: result,
    });
}));
const orderController = {
    requestQuotation,
    getOrders,
    getMyOrders,
    getSingleOrder,
    quotationApprove,
    updateOrderStatus,
    confirmOrder,
    declineOrder,
    invoiceUpload,
};
exports.default = orderController;
