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
const customError_util_1 = __importDefault(require("../../utils/customError.util"));
const sendResponse_util_1 = __importDefault(require("../../utils/sendResponse.util"));
const subCategory_service_1 = __importDefault(require("./subCategory.service"));
const subCategory_validation_1 = __importDefault(require("./subCategory.validation"));
const createSubCategory = (0, catchAsyncError_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        req.body.icon = file.path;
    }
    yield subCategory_validation_1.default.create.parseAsync(req.body);
    const result = yield subCategory_service_1.default.create(req.body);
    (0, sendResponse_util_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Sub Category created successfully",
        data: result,
    });
}));
const getSubCategories = (0, catchAsyncError_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getResult = yield subCategory_service_1.default.getSubCategories(req.queryFeatures);
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
const getSingleSubCategory = (0, catchAsyncError_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield subCategory_service_1.default.getSingleSubCategory(id, req.queryFeatures);
    if (!result) {
        throw new customError_util_1.default("Sub Category Not Found", http_status_1.default.NOT_FOUND);
    }
    (0, sendResponse_util_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        data: result,
    });
}));
const update = (0, catchAsyncError_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const file = req.file;
    if (file) {
        req.body.icon = file.path;
    }
    yield subCategory_validation_1.default.update.parseAsync(req.body);
    const result = yield subCategory_service_1.default.update(id, req.body);
    if (!result) {
        throw new customError_util_1.default("Requested Sub Category Not Found", http_status_1.default.NOT_FOUND);
    }
    (0, sendResponse_util_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Sub Category Updated Successfully",
        data: result,
    });
}));
const deleteSubCategory = (0, catchAsyncError_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield subCategory_service_1.default.deleteSubCategory(id);
    if (!result) {
        throw new customError_util_1.default("Requested Sub Category Not Found", http_status_1.default.NOT_FOUND);
    }
    (0, sendResponse_util_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Sub Category Deleted Successfully",
    });
}));
const subCategoryController = {
    createSubCategory,
    getSubCategories,
    getSingleSubCategory,
    update,
    deleteSubCategory,
};
exports.default = subCategoryController;
