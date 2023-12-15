"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const requestQuotation = zod_1.z.object({
    body: zod_1.z
        .object({
        items: zod_1.z.array(zod_1.z.object({
            productId: zod_1.z.string({
                required_error: "productId is required",
                invalid_type_error: "productId must be a string",
            }),
            quantity: zod_1.z.number({
                required_error: "quantity is required",
                invalid_type_error: "quantity must be a number",
            }),
        })),
    })
        .strict(),
});
const statusBody = zod_1.z.object({
    body: zod_1.z
        .object({
        status: zod_1.z.array(zod_1.z.enum([
            client_1.OrderStatus.requestQuotation,
            client_1.OrderStatus.quotationApproved,
            client_1.OrderStatus.spam,
            client_1.OrderStatus.ordered,
            client_1.OrderStatus.orderInProcess,
            client_1.OrderStatus.delivered,
        ], {
            invalid_type_error: "status must be a requestQuotation, quotationApproved, spam, ordered, orderInProcess or delivered",
            required_error: "status is required",
        })),
    })
        .strict(),
});
const update = zod_1.z.object({
    body: zod_1.z
        .object({
        status: zod_1.z.enum([client_1.OrderStatus.spam, client_1.OrderStatus.delivered], {
            invalid_type_error: "status must be a spam or delivered",
            required_error: "status is required",
        }),
    })
        .strict(),
});
const orderValidation = { requestQuotation, statusBody, update };
exports.default = orderValidation;
