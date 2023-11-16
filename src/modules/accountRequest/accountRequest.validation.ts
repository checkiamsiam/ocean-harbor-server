import { z } from "zod";

const create = z
  .object({
    title: z.string({
      required_error: "title is required",
    }),
    icon: z.string({
      required_error: "icon is required",
    }),
  })
  .strict();

const update = z
  .object({
    title: z.string().optional(),
    icon: z.string().optional(),
  })
  .strict();

const categoryValidation = {
  create,
  update,
};

export default categoryValidation;
