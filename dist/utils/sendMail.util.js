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
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const customError_util_1 = __importDefault(require("./customError.util"));
const sendEmail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nodeMailerOptions = {
            host: config_1.default.mailtrap.host,
            port: parseInt(config_1.default.mailtrap.port),
            auth: {
                user: config_1.default.mailtrap.auth.user,
                pass: config_1.default.mailtrap.auth.pass,
            },
            domain: config_1.default.mailtrap.domain,
        };
        // 1. create transporter
        const transporter = nodemailer_1.default.createTransport(nodeMailerOptions);
        // 2. define email options
        const mailOptions = Object.assign({ from: config_1.default.mailtrap.sendingEmail }, options);
        // 3. send email
        yield transporter.sendMail(mailOptions);
    }
    catch (error) {
        throw new customError_util_1.default("There was an error sending the email. Try again later!", http_status_1.default.INTERNAL_SERVER_ERROR);
    }
});
exports.default = sendEmail;
