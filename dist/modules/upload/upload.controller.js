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
const bulkUpload = (0, catchAsyncError_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    if (!files) {
        throw new customError_util_1.default("Files isn't Upload Properly", http_status_1.default.INTERNAL_SERVER_ERROR);
    }
    (0, sendResponse_util_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Profile get successfully",
        data: files,
    });
}));
const uploadController = {
    bulkUpload,
};
exports.default = uploadController;
