"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    const responseData = {
        success: data.success,
        message: data.message || undefined,
        meta: data.meta || undefined,
        data: data.data || undefined,
        error: data.error || undefined,
    };
    res.status(data.statusCode).json(responseData);
};
exports.default = sendResponse;
