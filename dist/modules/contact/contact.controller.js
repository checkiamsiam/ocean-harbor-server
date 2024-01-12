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
const config_1 = __importDefault(require("../../config"));
const catchAsyncError_util_1 = __importDefault(require("../../utils/catchAsyncError.util"));
const sendMail_util_1 = __importDefault(require("../../utils/sendMail.util"));
const sendResponse_util_1 = __importDefault(require("../../utils/sendResponse.util"));
const sendContactMail = (0, catchAsyncError_util_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    yield (0, sendMail_util_1.default)({
        to: (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.email,
        subject: "Thanks for contacting us",
        html: `
  <h3>Thanks for contacting us</h3>
  <p>Hi, ${(_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.name}</p>
  <p>Thanks for contacting us</p>
  <p>We will contact you soon</p>
  <p>Regards,</p>
  <p>Team</p>
  `,
    });
    yield (0, sendMail_util_1.default)({
        to: config_1.default.adminEmail,
        subject: "Contact Email from " + ((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.name),
        html: `
  <h3>Contact Email from ${(_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.name}</h3>
  <p>Hi, Admin</p>
  <p>You have received a contact email from ${(_e = req === null || req === void 0 ? void 0 : req.body) === null || _e === void 0 ? void 0 : _e.name}</p>
  <p>Company Name: ${(_f = req === null || req === void 0 ? void 0 : req.body) === null || _f === void 0 ? void 0 : _f.companyName}</p>
  <p>Email: ${(_g = req === null || req === void 0 ? void 0 : req.body) === null || _g === void 0 ? void 0 : _g.email}</p>
  <p>Phone: ${(_h = req === null || req === void 0 ? void 0 : req.body) === null || _h === void 0 ? void 0 : _h.phone}</p>
  <p>Message: ${(_j = req === null || req === void 0 ? void 0 : req.body) === null || _j === void 0 ? void 0 : _j.message}</p>
  <p>Regards,</p>
  <p>Team</p>
  `,
    });
    (0, sendResponse_util_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Contact Email sent successfully",
    });
}));
const contactController = {
    sendContactMail,
};
exports.default = contactController;
