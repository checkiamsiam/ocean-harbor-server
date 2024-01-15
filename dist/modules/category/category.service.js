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
const prisma_helper_1 = __importDefault(require("../../helpers/prisma.helper"));
const prismaClient_1 = __importDefault(require("../../shared/prismaClient"));
const generateId_util_1 = require("../../utils/generateId.util");
const create = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prismaClient_1.default.$transaction((txc) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const latestPost = yield txc.category.findMany({
            orderBy: { createdAt: "desc" },
            take: 1,
        });
        const generatedId = (0, generateId_util_1.generateNewID)("C-", (_a = latestPost[0]) === null || _a === void 0 ? void 0 : _a.id);
        payload.id = generatedId;
        const result = yield txc.category.create({
            data: payload,
        });
        return result;
    }));
    return result;
});
const getCategories = (queryFeatures) => __awaiter(void 0, void 0, void 0, function* () {
    const whereConditions = prisma_helper_1.default.findManyQueryHelper(queryFeatures, {
        searchFields: ["title"],
    });
    const query = {
        where: whereConditions,
        skip: queryFeatures.skip || undefined,
        take: queryFeatures.limit || undefined,
        orderBy: queryFeatures.sort,
    };
    if (queryFeatures.populate &&
        Object.keys(queryFeatures.populate).length > 0) {
        const queryFeaturePopulateCopy = Object.assign({}, queryFeatures.populate);
        if (queryFeatures.populate.brands) {
            queryFeaturePopulateCopy.brands = {
                include: {
                    brand: true,
                },
            };
        }
        query.include = Object.assign({ _count: true }, queryFeaturePopulateCopy);
    }
    else {
        if (queryFeatures.fields && Object.keys(queryFeatures.fields).length > 0) {
            query.select = Object.assign({ id: true }, queryFeatures.fields);
        }
    }
    const [result, count] = yield prismaClient_1.default.$transaction([
        prismaClient_1.default.category.findMany(query),
        prismaClient_1.default.category.count({ where: whereConditions }),
    ]);
    return {
        data: result,
        total: count,
    };
});
const getSingleCategory = (id, queryFeatures) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {
        where: {
            id,
        },
    };
    if (queryFeatures.populate &&
        Object.keys(queryFeatures.populate).length > 0) {
        const queryFeaturePopulateCopy = Object.assign({}, queryFeatures.populate);
        if (queryFeatures.populate.brands) {
            queryFeaturePopulateCopy.brands = {
                include: {
                    brand: true,
                },
            };
        }
        query.include = Object.assign({ _count: true }, queryFeaturePopulateCopy);
    }
    else {
        if (queryFeatures.fields && Object.keys(queryFeatures.fields).length > 0) {
            query.select = Object.assign({ id: true }, queryFeatures.fields);
        }
    }
    const result = yield prismaClient_1.default.category.findUnique(query);
    return result;
});
const update = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prismaClient_1.default.category.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prismaClient_1.default.category.delete({
        where: {
            id,
        },
    });
    return result;
});
const categoryService = {
    create,
    getCategories,
    getSingleCategory,
    update,
    deleteCategory,
};
exports.default = categoryService;
