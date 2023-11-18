"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const create = zod_1.z
    .object({
    title: zod_1.z.string({
        required_error: "title is required",
    }),
    icon: zod_1.z.string({
        required_error: "icon is required",
    }),
    categoryId: zod_1.z.string({
        required_error: "category id is required",
    }),
})
    .strict();
const update = zod_1.z
    .object({
    title: zod_1.z.string().optional(),
    icon: zod_1.z.string().optional(),
    categoryId: zod_1.z.string().optional(),
})
    .strict();
const subCategoryValidation = {
    create,
    update,
};
exports.default = subCategoryValidation;
