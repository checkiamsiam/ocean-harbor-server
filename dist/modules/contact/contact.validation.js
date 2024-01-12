"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const sendMail = zod_1.z.object({
    body: zod_1.z
        .object({
        name: zod_1.z.string({
            required_error: "title is required",
        }),
        companyName: zod_1.z.string({
            required_error: "companyName is required",
        }),
        email: zod_1.z
            .string({
            required_error: "email is required",
        })
            .email(),
        phone: zod_1.z.string({
            required_error: "phone is required",
        }),
        message: zod_1.z.string().optional(),
    })
        .strict(),
});
const contactValidation = {
    sendMail,
};
exports.default = contactValidation;
