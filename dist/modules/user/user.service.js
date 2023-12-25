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
const generateId_util_1 = require("../../utils/generateId.util");
const profile = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const include = user.role === client_1.UserRole.admin ? { admin: true } : { customer: true };
    const result = yield prismaClient_1.default.user.findUnique({
        where: {
            id: user.userId,
        },
        include: Object.assign({}, include),
    });
    if (!result) {
        throw new customError_util_1.default("User Not Found", http_status_1.default.NOT_FOUND);
    }
    return result;
});
const createCustomer = (customerData, user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prismaClient_1.default.$transaction((txc) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const latestPost = yield txc.user.findMany({
            orderBy: { createdAt: "desc" },
            take: 1,
        });
        const generatedId = (0, generateId_util_1.generateNewID)("U-", (_a = latestPost[0]) === null || _a === void 0 ? void 0 : _a.id);
        customerData.id = generatedId;
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
        var _b;
        const latestPost = yield txc.user.findMany({
            orderBy: { createdAt: "desc" },
            take: 1,
        });
        const generatedId = (0, generateId_util_1.generateNewID)("U-", (_b = latestPost[0]) === null || _b === void 0 ? void 0 : _b.id);
        adminData.id = generatedId;
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
const getCustomers = (queryFeatures) => __awaiter(void 0, void 0, void 0, function* () {
    const whereConditions = prisma_helper_1.default.findManyQueryHelper(queryFeatures, {
        searchFields: [
            "name",
            "companyName",
            "companyType",
            "companyRegNo",
            "companyDetails",
            "taxNumber",
            "address",
            "city",
            "country",
            "phone",
        ],
    });
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
        prismaClient_1.default.customer.findMany(query),
        prismaClient_1.default.customer.count({ where: whereConditions }),
    ]);
    return {
        data: result,
        total: count,
    };
});
const getAdmins = (queryFeatures) => __awaiter(void 0, void 0, void 0, function* () {
    const whereConditions = prisma_helper_1.default.findManyQueryHelper(queryFeatures, {
        searchFields: ["name", "phone"],
    });
    const query = {
        where: whereConditions,
        skip: queryFeatures.skip || undefined,
        take: queryFeatures.limit || undefined,
        orderBy: queryFeatures.sort,
    };
    if (queryFeatures.populate &&
        Object.keys(queryFeatures.populate).length > 0) {
        query.include = Object.assign({}, queryFeatures.populate);
    }
    else {
        if (queryFeatures.fields && Object.keys(queryFeatures.fields).length > 0) {
            query.select = Object.assign({ id: true }, queryFeatures.fields);
        }
    }
    const [result, count] = yield prismaClient_1.default.$transaction([
        prismaClient_1.default.admin.findMany(query),
        prismaClient_1.default.admin.count({ where: whereConditions }),
    ]);
    return {
        data: result,
        total: count,
    };
});
const getSingleCustomer = (id, queryFeatures) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {
        where: {
            id,
        },
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
    const result = yield prismaClient_1.default.customer.findUnique(query);
    return result;
});
const updateCustomer = (id, customerData, user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prismaClient_1.default.$transaction((txc) => __awaiter(void 0, void 0, void 0, function* () {
        const customer = yield txc.customer.update({
            where: {
                id,
            },
            data: Object.assign({}, customerData),
        });
        if (user.password) {
            user.password = yield (0, bcrypt_util_1.hashPassword)(user.password);
        }
        yield txc.user.update({
            where: {
                id,
            },
            data: Object.assign({}, user),
        });
        return customer;
    }));
    return result;
});
const userService = {
    createCustomer,
    createAdmin,
    profile,
    getCustomers,
    getAdmins,
    updateCustomer,
    getSingleCustomer,
};
exports.default = userService;
