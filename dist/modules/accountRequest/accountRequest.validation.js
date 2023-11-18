"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const create = zod_1.z.object({
    body: zod_1.z
        .object({
        name: zod_1.z.string({
            required_error: "title is required",
        }),
        companyName: zod_1.z.string({
            required_error: "companyName is required",
        }),
        companyType: zod_1.z.string({
            required_error: "companyType is required",
        }),
        companyRegNo: zod_1.z.string({
            required_error: "companyType is required",
        }),
        companyDetails: zod_1.z.string({
            required_error: "companyDetails is required",
        }),
        taxNumber: zod_1.z.string({
            required_error: "taxNumber is required",
        }),
        address: zod_1.z.string({
            required_error: "address is required",
        }),
        city: zod_1.z.string({
            required_error: "city is required",
        }),
        country: zod_1.z.string({
            required_error: "country is required",
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
const accept = zod_1.z.object({
    body: zod_1.z
        .object({
        password: zod_1.z.string({
            required_error: "password is required",
        }),
    })
        .strict(),
});
const accountReqValidation = {
    create,
    accept,
};
exports.default = accountReqValidation;
