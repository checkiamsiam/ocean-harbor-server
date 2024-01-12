import { z } from "zod";

const sendMail = z.object({
  body: z
    .object({
      name: z.string({
        required_error: "title is required",
      }),
      companyName: z.string({
        required_error: "companyName is required",
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

const contactValidation = {
  sendMail,
};

export default contactValidation;
