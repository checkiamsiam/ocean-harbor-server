import { z } from "zod";

const create = z.object({
  body: z
    .object({
      name: z.string({
        required_error: "title is required",
      }),
      companyName: z.string({
        required_error: "companyName is required",
      }),
      companyType: z.string({
        required_error: "companyType is required",
      }),
      companyRegNo: z.string({
        required_error: "companyType is required",
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
      email: z
        .string({
          required_error: "email is required",
        })
        .email(),
      phone: z.string({
        required_error: "phone is required",
      }),
      message: z.string().optional(),
    })
    .strict(),
});

const accept = z.object({
  body: z
    .object({
      password: z.string({
        required_error: "password is required",
      }),
    })
    .strict(),
});

const accountReqValidation = {
  create,
  accept,
};

export default accountReqValidation;
