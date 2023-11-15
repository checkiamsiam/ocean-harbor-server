import { z } from "zod";

const create = z
  .object({
    title: z
      .string({
        required_error: "title is required",
      })
      .email(),
    icon: z.string({
      required_error: "icon is required",
    }),
    categoryId: z.string({
      required_error: "category id is required",
    }),
  })
  .strict();

const update = z
  .object({
    title: z.string().email().optional(),
    icon: z.string().optional(),
    categoryId: z.string().optional(),
  })
  .strict();

const subCategoryValidation = {
  create,
  update,
};

export default subCategoryValidation;
