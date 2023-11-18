"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const create = zod_1.z
    .object({
    title: zod_1.z.string({
        required_error: "title is required",
    }),
    logo: zod_1.z.string({
        required_error: "icon is required",
    }),
})
    .strict();
const update = zod_1.z
    .object({
    title: zod_1.z.string().optional(),
    logo: zod_1.z.string().optional(),
})
    .strict();
const brandValidation = {
    create,
    update,
};
exports.default = brandValidation;
