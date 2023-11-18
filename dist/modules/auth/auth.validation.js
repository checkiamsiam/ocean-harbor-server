"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const loginReq = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: "email is required",
        })
            .email(),
        password: zod_1.z.string({
            required_error: "Password is required",
        }),
    }),
});
const authValidation = {
    loginReq,
};
exports.default = authValidation;
