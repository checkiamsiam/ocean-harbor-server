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
const prismaClient_1 = __importDefault(require("../../shared/prismaClient"));
const getNotifications = (user, queryFeatures) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.role === client_1.UserRole.admin) {
        const [result, count] = yield prismaClient_1.default.$transaction([
            prismaClient_1.default.adminNotification.findMany({
                skip: queryFeatures.skip || undefined,
                take: queryFeatures.limit || undefined,
                orderBy: queryFeatures.sort,
            }),
            prismaClient_1.default.adminNotification.count(),
        ]);
        return {
            data: result,
            total: count,
        };
    }
    else {
        const whereConditions = {
            customerId: user.userId,
        };
        const [result, count] = yield prismaClient_1.default.$transaction([
            prismaClient_1.default.customerNotification.findMany({
                where: whereConditions,
                skip: queryFeatures.skip || undefined,
                take: queryFeatures.limit || undefined,
                orderBy: queryFeatures.sort,
            }),
            prismaClient_1.default.customerNotification.count({ where: whereConditions }),
        ]);
        return {
            data: result,
            total: count,
        };
    }
});
const markAsRead = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.role === client_1.UserRole.admin) {
        const result = yield prismaClient_1.default.adminNotification.update({
            where: {
                id: parseInt(id),
            },
            data: {
                read: true,
            },
        });
        return result;
    }
    else {
        const result = yield prismaClient_1.default.customerNotification.update({
            where: {
                customerId: user.userId,
                id: parseInt(id),
            },
            data: {
                read: true,
            },
        });
        return result;
    }
});
const markAllAsRead = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.role === client_1.UserRole.admin) {
        yield prismaClient_1.default.adminNotification.updateMany({
            data: {
                read: true,
            },
        });
    }
    else {
        yield prismaClient_1.default.customerNotification.updateMany({
            where: {
                customerId: user.userId,
            },
            data: {
                read: true,
            },
        });
    }
});
const notificationService = {
    getNotifications,
    markAsRead,
    markAllAsRead,
};
exports.default = notificationService;
