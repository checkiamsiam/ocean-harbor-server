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
const prisma_helper_1 = __importDefault(require("../../helpers/prisma.helper"));
const prismaClient_1 = __importDefault(require("../../shared/prismaClient"));
const bcrypt_util_1 = require("../../utils/bcrypt.util");
const customError_util_1 = __importDefault(require("../../utils/customError.util"));
const create = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prismaClient_1.default.$transaction((txc) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield txc.accountRequest.create({
            data: payload,
        });
        yield txc.adminNotification.create({
            data: {
                message: `New account request from ${payload.name}`,
                type: client_1.AdminNotificationType.AccountRequest,
                title: "New account request",
                refId: result.id,
            },
        });
        return result;
    }));
    return result;
});
const getAccountRequests = (queryFeatures) => __awaiter(void 0, void 0, void 0, function* () {
    const whereConditions = prisma_helper_1.default.findManyQueryHelper(queryFeatures, {
        searchFields: ["title"],
    });
    const query = {
        where: whereConditions,
        skip: queryFeatures.skip || undefined,
        take: queryFeatures.limit || undefined,
        orderBy: queryFeatures.sort,
    };
    if (queryFeatures.fields && Object.keys(queryFeatures.fields).length > 0) {
        query.select = Object.assign({ id: true }, queryFeatures.fields);
    }
    const [result, count] = yield prismaClient_1.default.$transaction([
        prismaClient_1.default.accountRequest.findMany(query),
        prismaClient_1.default.accountRequest.count({ where: whereConditions }),
    ]);
    return {
        data: result,
        total: count,
    };
});
const getSingleAccountRequest = (id, queryFeatures) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {
        where: {
            id,
        },
    };
    if (queryFeatures.fields && Object.keys(queryFeatures.fields).length > 0) {
        query.select = Object.assign({ id: true }, queryFeatures.fields);
    }
    const result = yield prismaClient_1.default.accountRequest.findUnique(query);
    return result;
});
const acceptAccountRequest = (id, password) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield prismaClient_1.default.$transaction((txc) => __awaiter(void 0, void 0, void 0, function* () {
        const accountRequestData = yield txc.accountRequest.delete({
            where: { id },
        });
        if (!accountRequestData) {
            throw new customError_util_1.default("Account request not found", http_status_1.default.NOT_FOUND);
        }
        const username = accountRequestData.email.split("@")[0];
        const newUserData = {
            email: accountRequestData.email,
            username,
        };
        newUserData.password = yield (0, bcrypt_util_1.hashPassword)(password);
        const newCustomerData = {
            name: accountRequestData.name,
            companyName: accountRequestData.companyName,
            companyType: accountRequestData.companyType,
            companyRegNo: accountRequestData.companyRegNo,
            companyDetails: accountRequestData.companyDetails,
            taxNumber: accountRequestData.taxNumber,
            address: accountRequestData.address,
            city: accountRequestData.city,
            country: accountRequestData.country,
            phone: accountRequestData.phone,
        };
        const customer = yield txc.customer.create({
            data: newCustomerData,
        });
        yield txc.user.create({
            data: Object.assign(Object.assign({}, newUserData), { customerId: customer.id }),
        });
        return customer;
    }));
    return customer;
});
const deleteAccountRequest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prismaClient_1.default.accountRequest.delete({
        where: {
            id,
        },
    });
    return result;
});
const accountReqService = {
    create,
    getAccountRequests,
    getSingleAccountRequest,
    acceptAccountRequest,
    deleteAccountRequest,
};
exports.default = accountReqService;
