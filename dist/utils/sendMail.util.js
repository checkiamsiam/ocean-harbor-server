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
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const nodeMailerOptions = {
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "1e6163b2567141",
            pass: "337ff57f9a511d",
        },
        // domain: "domain.com",
    };
    // 1. create transporter
    const transporter = nodemailer_1.default.createTransport(nodeMailerOptions);
    // 2. define email options
    const mailOptions = Object.assign({ from: "siam@tigotek.net" }, options);
    // 3. send email
    yield transporter.sendMail(mailOptions);
});
exports.default = sendEmail;
