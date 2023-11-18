"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = __importDefault(require("./config"));
const globalErrorHandler_middleware_1 = __importDefault(require("./middleware/globalErrorHandler.middleware"));
const routes_1 = __importDefault(require("./routes"));
const sendResponse_util_1 = __importDefault(require("./utils/sendResponse.util"));
const app = (0, express_1.default)();
//global app middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, hpp_1.default)());
//development middleware
if (config_1.default.isDevelopment) {
    app.use((0, morgan_1.default)("dev"));
}
//routes
app.use("/api/v1", routes_1.default);
// root
app.get("/", (req, res) => {
    (0, sendResponse_util_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Welcome to golden anchor server",
    });
});
// Not found catch
app.all("*", (req, res) => {
    (0, sendResponse_util_1.default)(res, {
        statusCode: 200,
        success: false,
        message: "Adress not found",
    });
});
// error handling middleware
app.use(globalErrorHandler_middleware_1.default);
exports.default = app;
