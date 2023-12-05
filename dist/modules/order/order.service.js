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
const prismaClient_1 = __importDefault(require("../../shared/prismaClient"));
const customError_util_1 = __importDefault(require("../../utils/customError.util"));
const requestQuotation = (authUserId, items) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prismaClient_1.default.$transaction((txc) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const order = yield txc.order.create({
            data: {
                customerId: authUserId,
                status: client_1.OrderStatus.requestQuotation,
            },
        });
        const orderItemsData = items.map((item) => {
            return {
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
            };
        });
        yield txc.orderItem.createMany({
            data: orderItemsData,
        });
        const orderResponse = yield txc.order.findUnique({
            where: {
                id: order.id,
            },
            include: {
                _count: true,
                products: true,
                customer: true,
            },
        });
        yield txc.adminNotification.create({
            data: {
                message: `New Quotation request from ${(_a = orderResponse === null || orderResponse === void 0 ? void 0 : orderResponse.customer) === null || _a === void 0 ? void 0 : _a.name}`,
                type: client_1.AdminNotificationType.quotationRequest,
                title: "New Quotation request",
                refId: orderResponse === null || orderResponse === void 0 ? void 0 : orderResponse.id,
            },
        });
        return orderResponse;
    }));
    if (!result) {
        throw new customError_util_1.default("Order not created", http_status_1.default.INTERNAL_SERVER_ERROR);
    }
    return result;
});
const getSingleOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prismaClient_1.default.order.findUnique({
        where: {
            id,
        },
        include: {
            _count: true,
            products: {
                include: {
                    product: true,
                    order: true,
                },
            },
            customer: true,
        },
    });
    return result;
});
const getOrders = (status, queryFeatures) => __awaiter(void 0, void 0, void 0, function* () {
    const whereConditions = {
        status,
    };
    const query = {
        where: whereConditions,
        skip: queryFeatures.skip || undefined,
        take: queryFeatures.limit || undefined,
        orderBy: queryFeatures.sort,
    };
    if (queryFeatures.populate &&
        Object.keys(queryFeatures.populate).length > 0) {
        query.include = Object.assign({ _count: true }, queryFeatures.populate);
    }
    else {
        if (queryFeatures.fields && Object.keys(queryFeatures.fields).length > 0) {
            query.select = Object.assign({ id: true }, queryFeatures.fields);
        }
    }
    const [result, count] = yield prismaClient_1.default.$transaction([
        prismaClient_1.default.order.findMany(query),
        prismaClient_1.default.order.count({ where: whereConditions }),
    ]);
    return {
        data: result,
        total: count,
    };
});
const getMyOrders = (status, authUserId, queryFeatures) => __awaiter(void 0, void 0, void 0, function* () {
    const whereConditions = {
        AND: [
            {
                customerId: authUserId,
            },
            {
                status,
            },
        ],
    };
    const query = {
        where: whereConditions,
        skip: queryFeatures.skip || undefined,
        take: queryFeatures.limit || undefined,
        orderBy: queryFeatures.sort,
    };
    if (queryFeatures.populate &&
        Object.keys(queryFeatures.populate).length > 0) {
        query.include = Object.assign({ _count: true }, queryFeatures.populate);
    }
    else {
        if (queryFeatures.fields && Object.keys(queryFeatures.fields).length > 0) {
            query.select = Object.assign({ id: true }, queryFeatures.fields);
        }
    }
    const [result, count] = yield prismaClient_1.default.$transaction([
        prismaClient_1.default.order.findMany(query),
        prismaClient_1.default.order.count({ where: whereConditions }),
    ]);
    return {
        data: result,
        total: count,
    };
});
const quotationApprove = (id, quotationFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prismaClient_1.default.$transaction((txc) => __awaiter(void 0, void 0, void 0, function* () {
        const order = yield txc.order.findUnique({
            where: {
                id,
            },
        });
        if (!order || order.status !== client_1.OrderStatus.requestQuotation) {
            throw new customError_util_1.default("Order you want to approve is not requested yet or already approved", http_status_1.default.NOT_FOUND);
        }
        const orderResponse = yield txc.order.update({
            where: {
                id,
            },
            data: {
                status: client_1.OrderStatus.quotationApproved,
                quotation: quotationFilePath,
            },
            include: {
                _count: true,
                products: true,
            },
        });
        yield txc.customerNotification.create({
            data: {
                message: `Your quotation request is approved by admin`,
                type: client_1.CustomerNotificationType.quotationApproved,
                title: "Quotation request approved",
                refId: orderResponse === null || orderResponse === void 0 ? void 0 : orderResponse.id,
                customerId: orderResponse === null || orderResponse === void 0 ? void 0 : orderResponse.customerId,
            },
        });
        return orderResponse;
    }));
    if (!result) {
        throw new customError_util_1.default("Order not updated", http_status_1.default.INTERNAL_SERVER_ERROR);
    }
    return result;
});
const updateOrderStatus = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prismaClient_1.default.$transaction((txc) => __awaiter(void 0, void 0, void 0, function* () {
        const orderResponse = yield txc.order.update({
            where: {
                id,
            },
            data: payload,
            include: {
                _count: true,
                products: true,
            },
        });
        if (payload.status === client_1.OrderStatus.spam) {
            yield txc.customerNotification.create({
                data: {
                    message: `Your Quotation is declined by admin`,
                    type: client_1.CustomerNotificationType.quotationDeclined,
                    title: "Quotation Request declined",
                    refId: orderResponse === null || orderResponse === void 0 ? void 0 : orderResponse.id,
                    customerId: orderResponse === null || orderResponse === void 0 ? void 0 : orderResponse.customerId,
                },
            });
        }
        return orderResponse;
    }));
    if (!result) {
        throw new customError_util_1.default("Order not updated", http_status_1.default.INTERNAL_SERVER_ERROR);
    }
    return result;
});
const confirmOrDeclineOrder = (id, authUserId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prismaClient_1.default.$transaction((txc) => __awaiter(void 0, void 0, void 0, function* () {
        var _b, _c;
        const order = yield txc.order.findUnique({
            where: {
                id,
            },
        });
        if (!order ||
            order.status !== client_1.OrderStatus.quotationApproved ||
            order.customerId !== authUserId) {
            throw new customError_util_1.default("Order you want to confirm/decline is not approved yet or already confirm or its to her/his order", http_status_1.default.NOT_FOUND);
        }
        const orderResponse = yield txc.order.update({
            where: {
                id,
            },
            data: {
                status: status,
            },
            include: {
                _count: true,
                products: true,
                customer: true,
            },
        });
        if (status === client_1.OrderStatus.ordered) {
            yield txc.adminNotification.create({
                data: {
                    message: `${(_b = orderResponse === null || orderResponse === void 0 ? void 0 : orderResponse.customer) === null || _b === void 0 ? void 0 : _b.name} confirmed the order For Order Id: ${orderResponse === null || orderResponse === void 0 ? void 0 : orderResponse.id}`,
                    type: client_1.AdminNotificationType.confirmOrder,
                    title: "Order confirmed",
                    refId: orderResponse === null || orderResponse === void 0 ? void 0 : orderResponse.id,
                },
            });
        }
        if (status === client_1.OrderStatus.declined) {
            yield txc.adminNotification.create({
                data: {
                    message: `${(_c = orderResponse === null || orderResponse === void 0 ? void 0 : orderResponse.customer) === null || _c === void 0 ? void 0 : _c.name} declined the order For Order Id: ${orderResponse === null || orderResponse === void 0 ? void 0 : orderResponse.id}`,
                    type: client_1.AdminNotificationType.declineOrder,
                    title: "Order declined",
                    refId: orderResponse === null || orderResponse === void 0 ? void 0 : orderResponse.id,
                },
            });
        }
        return orderResponse;
    }));
    if (!result) {
        throw new customError_util_1.default("Order not updated", http_status_1.default.INTERNAL_SERVER_ERROR);
    }
    return result;
});
const invoiceUpload = (id, invoiceFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prismaClient_1.default.$transaction((txc) => __awaiter(void 0, void 0, void 0, function* () {
        const order = yield txc.order.findUnique({
            where: {
                id,
            },
        });
        if (!order || order.status !== client_1.OrderStatus.ordered) {
            throw new customError_util_1.default("Order you want to approve is not requested yet or already approved", http_status_1.default.NOT_FOUND);
        }
        const orderResponse = yield txc.order.update({
            where: {
                id,
            },
            data: {
                status: client_1.OrderStatus.orderInProcess,
                invoice: invoiceFilePath,
            },
            include: {
                _count: true,
                products: true,
            },
        });
        yield txc.customerNotification.create({
            data: {
                message: `Admin uploaded invoice for your order`,
                type: client_1.CustomerNotificationType.invoiceAdded,
                title: "Invoice Added",
                refId: orderResponse === null || orderResponse === void 0 ? void 0 : orderResponse.id,
                customerId: orderResponse === null || orderResponse === void 0 ? void 0 : orderResponse.customerId,
            },
        });
        return orderResponse;
    }));
    if (!result) {
        throw new customError_util_1.default("Order not updated", http_status_1.default.INTERNAL_SERVER_ERROR);
    }
    return result;
});
const makeUnConfirmedOrderToSpamStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentDate = new Date();
        const fourteenDaysAgo = new Date(currentDate.getTime() - 1209600000); // 14 days in milliseconds
        yield prismaClient_1.default.order.updateMany({
            where: {
                AND: [
                    { status: client_1.OrderStatus.quotationApproved },
                    {
                        createdAt: {
                            lt: fourteenDaysAgo,
                        },
                    },
                ],
            },
            data: {
                status: client_1.OrderStatus.spam,
            },
        });
    }
    catch (error) {
        console.log(error);
    }
});
const orderService = {
    requestQuotation,
    getOrders,
    getMyOrders,
    getSingleOrder,
    quotationApprove,
    confirmOrDeclineOrder,
    updateOrderStatus,
    invoiceUpload,
    makeUnConfirmedOrderToSpamStatus,
};
exports.default = orderService;
