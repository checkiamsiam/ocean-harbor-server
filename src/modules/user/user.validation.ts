import { CustomerStatus } from "@prisma/client";
import { z } from "zod";

const createCustomerReq = z.object({
  body: z
    .object({
      password: z.string({
        required_error: "Password is required",
      }),
      name: z.string({
        required_error: "Name is required",
      }),
      companyName: z.string({
        required_error: "Company name is required",
      }),
      companyType: z.string({
        required_error: "companyType is required",
      }),
      companyRegNo: z.string({
        required_error: "companyRegNo is required",
      }),
      companyDetails: z.string({
        required_error: "companyDetails is required",
      }),
      taxNumber: z.string({
        required_error: "taxNumber is required",
      }),
      address: z.string({
        required_error: "address is required",
      }),
      city: z.string({
        required_error: "city is required",
      }),
      country: z.string({
        required_error: "country is required",
      }),
      phone: z.string({
        required_error: "phone is required",
      }),
      email: z
        .string({
          required_error: "Email is required",
        })
        .email(),
    })
    .strict(),
});
const updateCustomerReq = z.object({
  body: z
    .object({
      password: z.string().optional(),
      name: z.string().optional(),
      companyName: z.string().optional(),
      companyType: z.string().optional(),
      companyRegNo: z.string().optional(),
      companyDetails: z.string().optional(),
      taxNumber: z.string().optional(),
      address: z.string().optional(),
      city: z.string().optional(),
      country: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().email().optional(),
      status: z
        .enum([CustomerStatus.active, CustomerStatus.disabled])
        .optional(),
    })
    .strict(),
});

const createAdminReq = z.object({
  body: z.object({
    password: z.string({
      required_error: "Password is required",
    }),
    name: z.string({
      required_error: "Name is required",
    }),
    phone: z.string({
      required_error: "phone is required",
    }),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email(),
  }),
});

const userValidations = {
  createCustomerReq,
  createAdminReq,
  updateCustomerReq,
};

export default userValidations;
