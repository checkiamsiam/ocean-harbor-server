import { z } from "zod";

const create = z
  .object({
    title: z.string({
      required_error: "title is required",
    }),
    logo: z.string({
      required_error: "icon is required",
    }),
  })
  .strict();

const update = z
  .object({
    title: z.string().optional(),
    logo: z.string().optional(),
  })
  .strict();

const brandValidation = {
  create,
  update,
};

export default brandValidation;
