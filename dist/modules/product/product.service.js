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
const prisma_helper_1 = __importDefault(require("../../helpers/prisma.helper"));
const prismaClient_1 = __importDefault(require("../../shared/prismaClient"));
const asyncForEach_util_1 = require("../../utils/asyncForEach.util");
const customError_util_1 = __importDefault(require("../../utils/customError.util"));
const generateId_util_1 = require("../../utils/generateId.util");
const create = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prismaClient_1.default.$transaction((txc) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const subCategoryExist = yield txc.category.findUnique({
            where: {
                id: payload.categoryId,
            },
            include: {
                subCategories: true,
            },
        });
        const isCatSubOk = subCategoryExist === null || subCategoryExist === void 0 ? void 0 : subCategoryExist.subCategories.find((subCat) => subCat.id === payload.subCategoryId);
        if (!isCatSubOk) {
            throw new customError_util_1.default("Sub Category Is not available in that category", http_status_1.default.BAD_REQUEST);
        }
        const latestPost = yield txc.product.findMany({
            orderBy: [{ createdAt: "desc" }, { id: "desc" }],
            take: 1,
        });
        const generatedId = (0, generateId_util_1.generateNewID)("P-", (_a = latestPost[0]) === null || _a === void 0 ? void 0 : _a.id);
        payload.id = generatedId;
        const product = yield txc.product.create({
            data: payload,
        });
        const isCategoryBrandExist = yield txc.categoryBrand.findFirst({
            where: {
                brandId: product.brandId,
                categoryId: product.categoryId,
            },
        });
        if (!isCategoryBrandExist) {
            yield txc.categoryBrand.create({
                data: {
                    brandId: product.brandId,
                    categoryId: product.categoryId,
                },
            });
        }
        return product;
    }));
    return result;
});
const bulkCreate = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const results = [];
    yield prismaClient_1.default.$transaction((txc) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, asyncForEach_util_1.asyncForEach)(payload, (product) => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            const newProductBody = Object.assign({}, product);
            const latestPost = yield txc.product.findMany({
                orderBy: [{ createdAt: "desc" }, { id: "desc" }],
                take: 1,
            });
            const generatedId = (0, generateId_util_1.generateNewID)("P-", (_b = latestPost[0]) === null || _b === void 0 ? void 0 : _b.id);
            newProductBody.id = generatedId;
            console.log(newProductBody.id);
            const newProduct = yield txc.product.create({
                data: newProductBody,
            });
            const isCategoryBrandExist = yield txc.categoryBrand.findFirst({
                where: {
                    brandId: newProduct.brandId,
                    categoryId: newProduct.categoryId,
                },
            });
            if (!isCategoryBrandExist) {
                yield txc.categoryBrand.create({
                    data: {
                        brandId: newProduct.brandId,
                        categoryId: newProduct.categoryId,
                    },
                });
            }
            results.push(newProduct);
        }));
    }), { timeout: 100000 });
    return results;
});
const getProducts = (queryFeatures) => __awaiter(void 0, void 0, void 0, function* () {
    const whereConditions = prisma_helper_1.default.findManyQueryHelper(queryFeatures, {
        searchFields: ["title"],
        relationalFields: {
            categoryId: "category",
            brandId: "brand",
            subCategoryId: "subCategory",
        },
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
        prismaClient_1.default.product.findMany(query),
        prismaClient_1.default.product.count({ where: whereConditions }),
    ]);
    return {
        data: result,
        total: count,
    };
});
const getSingleProduct = (id, queryFeatures) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield prismaClient_1.default.product.findUnique(query);
    return result;
});
const update = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prismaClient_1.default.$transaction((txc) => __awaiter(void 0, void 0, void 0, function* () {
        if (payload.subCategoryId) {
            let categoryIdForSubCategory;
            if (payload.categoryId) {
                categoryIdForSubCategory = payload.categoryId;
            }
            else {
                const updatingProduct = yield txc.product.findUnique({
                    where: {
                        id,
                    },
                });
                if (!updatingProduct) {
                    throw new customError_util_1.default("Product Not Found", http_status_1.default.NOT_FOUND);
                }
                categoryIdForSubCategory = updatingProduct === null || updatingProduct === void 0 ? void 0 : updatingProduct.categoryId;
            }
            const subCategoryExist = yield txc.category.findUnique({
                where: {
                    id: categoryIdForSubCategory,
                },
                include: {
                    subCategories: true,
                },
            });
            const isCatSubOk = subCategoryExist === null || subCategoryExist === void 0 ? void 0 : subCategoryExist.subCategories.find((subCat) => subCat.id === payload.subCategoryId);
            if (!isCatSubOk) {
                throw new customError_util_1.default("Sub Category Is not available in that category", http_status_1.default.BAD_REQUEST);
            }
        }
        const updatedProduct = yield txc.product.update({
            where: {
                id,
            },
            data: payload,
        });
        if (payload.categoryId || payload.brandId) {
            const isCategoryBrandExist = yield txc.categoryBrand.findFirst({
                where: {
                    brandId: updatedProduct.brandId,
                    categoryId: updatedProduct.categoryId,
                },
            });
            if (!isCategoryBrandExist) {
                yield txc.categoryBrand.create({
                    data: {
                        brandId: updatedProduct.brandId,
                        categoryId: updatedProduct.categoryId,
                    },
                });
            }
        }
        return updatedProduct;
    }));
    return result;
});
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prismaClient_1.default.$transaction((txc) => __awaiter(void 0, void 0, void 0, function* () {
        const deletedProduct = yield txc.product.delete({
            where: {
                id,
            },
        });
        if (deletedProduct) {
            const isCategoryBrandExist = yield txc.product.findFirst({
                where: {
                    brandId: deletedProduct.brandId,
                    categoryId: deletedProduct.categoryId,
                },
            });
            if (!isCategoryBrandExist) {
                yield txc.categoryBrand.delete({
                    where: {
                        categoryId_brandId: {
                            categoryId: deletedProduct.categoryId,
                            brandId: deletedProduct.brandId,
                        },
                    },
                });
            }
        }
        return deletedProduct;
    }));
    return result;
});
const productService = {
    create,
    getProducts,
    getSingleProduct,
    update,
    deleteProduct,
    bulkCreate,
};
exports.default = productService;
