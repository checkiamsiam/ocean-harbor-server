"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const createCustomerReq = zod_1.z.object({
    body: zod_1.z
        .object({
        password: zod_1.z.string({
            required_error: "Password is required",
        }),
        name: zod_1.z.string({
            required_error: "Name is required",
        }),
        companyName: zod_1.z.string({
            required_error: "Company name is required",
        }),
        companyType: zod_1.z.string({
            required_error: "companyType is required",
        }),
        companyRegNo: zod_1.z.string({
            required_error: "companyRegNo is required",
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
        phone: zod_1.z.string({
            required_error: "phone is required",
        }),
        email: zod_1.z
            .string({
            required_error: "Email is required",
        })
            .email(),
    })
        .strict(),
});
const createAdminReq = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string({
            required_error: "Password is required",
        }),
        name: zod_1.z.string({
            required_error: "Name is required",
        }),
        phone: zod_1.z.string({
            required_error: "phone is required",
        }),
        email: zod_1.z
            .string({
            required_error: "Email is required",
        })
            .email(),
    }),
});
const userValidations = { createCustomerReq, createAdminReq };
exports.default = userValidations;
