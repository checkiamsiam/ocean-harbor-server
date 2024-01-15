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
const catchAsyncError_util_1 = __importDefault(require("../../utils/catchAsyncError.util"));
const sendResponse_util_1 = __importDefault(require("../../utils/sendResponse.util"));
const brand_service_1 = __importDefault(require("../brand/brand.service"));
const category_service_1 = __importDefault(require("../category/category.service"));
const product_service_1 = __importDefault(require("../product/product.service"));
const globalSearch = (0, catchAsyncError_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const queryFeatureCopy = {
        limit: req.queryFeatures.limit || undefined,
        page: req.queryFeatures.page,
        skip: req.queryFeatures.skip || undefined,
        searchKey: req.queryFeatures.searchKey,
        fields: {},
        filters: {},
        populate: {},
        sort: req.queryFeatures.sort,
    };
    const products = yield product_service_1.default.getProducts(queryFeatureCopy);
    const categories = yield category_service_1.default.getCategories(queryFeatureCopy);
    const brands = yield brand_service_1.default.getBrands(queryFeatureCopy);
    (0, sendResponse_util_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        meta: {
            total: products.total,
            limit: queryFeatureCopy.limit,
            page: queryFeatureCopy.page,
        },
        data: {
            products: products.data,
            categories: categories.data,
            brands: brands.data,
        },
    });
}));
const searchController = {
    globalSearch,
};
exports.default = searchController;
