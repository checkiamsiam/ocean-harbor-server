"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const create = zod_1.z
    .object({
    title: zod_1.z.string({
        required_error: "title is required",
    }),
    image: zod_1.z.string({
        required_error: "image is required",
    }),
    netWeight: zod_1.z.string({
        required_error: "netWeight is required",
    }),
    packetPerBox: zod_1.z.string({
        required_error: "packetPerBox is required",
    }),
    status: zod_1.z
        .enum(["active", "disabled"], {
        invalid_type_error: "status must be a active or disabled",
    })
        .optional(),
    type: zod_1.z.enum(["frozen", "dry"], {
        required_error: "type is must required",
        invalid_type_error: "type must be a dry or frozen",
    }),
    categoryId: zod_1.z.string({
        required_error: "categoryId is required",
    }),
    subCategoryId: zod_1.z.string({
        required_error: "subCategoryId is required",
    }),
    brandId: zod_1.z.string({
        required_error: "subCategoryId is required",
    }),
})
    .strict();
const update = zod_1.z
    .object({
    title: zod_1.z.string().optional(),
    image: zod_1.z.string().optional(),
    netWeight: zod_1.z.string().optional(),
    packetPerBox: zod_1.z.string().optional(),
    status: zod_1.z
        .enum(["active", "disabled"], {
        invalid_type_error: "status must be a active or disabled",
    })
        .optional(),
    type: zod_1.z
        .enum(["frozen", "dry"], {
        invalid_type_error: "type must be a dry or frozen",
    })
        .optional(),
    categoryId: zod_1.z.string().optional(),
    subCategoryId: zod_1.z.string().optional(),
    brandId: zod_1.z.string().optional(),
})
    .strict();
const productValidation = {
    create,
    update,
};
exports.default = productValidation;
