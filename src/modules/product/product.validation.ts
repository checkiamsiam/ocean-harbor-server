import { z } from "zod";

const create = z
  .object({
    title: z.string({
      required_error: "title is required",
    }),
    image: z.string({
      required_error: "image is required",
    }),
    netWeight: z.string({
      required_error: "netWeight is required",
    }),
    packetPerBox: z.string({
      required_error: "packetPerBox is required",
    }),
    status: z
      .enum(["active", "disabled"] as [string, ...string[]], {
        invalid_type_error: "status must be a active or disabled",
      })
      .optional(),
    type: z.enum(["frozen", "dry"] as [string, ...string[]], {
      required_error: "type is must required",
      invalid_type_error: "type must be a dry or frozen",
    }),
    categoryId: z.string({
      required_error: "categoryId is required",
    }),
    subCategoryId: z.string({
      required_error: "subCategoryId is required",
    }),
    brandId: z.string({
      required_error: "subCategoryId is required",
    }),
  })
  .strict();

const update = z
  .object({
    title: z.string().optional(),
    image: z.string().optional(),
    netWeight: z.string().optional(),
    packetPerBox: z.string().optional(),
    status: z
      .enum(["active", "disabled"] as [string, ...string[]], {
        invalid_type_error: "status must be a active or disabled",
      })
      .optional(),
    type: z
      .enum(["frozen", "dry"] as [string, ...string[]], {
        invalid_type_error: "type must be a dry or frozen",
      })
      .optional(),
    categoryId: z.string().optional(),
    subCategoryId: z.string().optional(),
    brandId: z.string().optional(),
  })
  .strict();

const productValidation = {
  create,
  update,
};

export default productValidation;
