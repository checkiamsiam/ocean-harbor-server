import { z } from "zod";

const loginReq = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "email is required",
      })
      .email(),
    password: z.string({
      required_error: "Password is required",
    }),
  }),
});

const authValidation = {
  loginReq,
};

export default authValidation;
