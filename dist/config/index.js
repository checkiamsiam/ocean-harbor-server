"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    isDevelopment: process.env.NODE_ENV === "development",
    port: process.env.PORT || 5000,
    jwt: {
        secret: process.env.JWT_SECRET || "secret",
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    },
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
        apiKey: process.env.CLOUDINARY_API_KEY || "",
        apiSecret: process.env.CLOUDINARY_API_SECRET || "",
    },
    mailtrap: {
        host: process.env.MAILTRAP_HOST || "",
        port: process.env.MAILTRAP_PORT || "",
        auth: {
            user: process.env.MAILTRAP_USER || "",
            pass: process.env.MAILTRAP_PASSWORD || "",
        },
        domain: process.env.MAILTRAP_DOMAIN || "",
        sendingEmail: process.env.MAILTRAP_SENDING_EMAIL || "",
    }
};
exports.default = config;
