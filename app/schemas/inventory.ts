import { z } from "zod";

export const createSchema = z.object({
  title: z.string().min(2, {
    message: "Product title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  sku: z.string().min(1, {
    message: "SKU is required.",
  }),
  price: z.coerce.number().min(0, {
    message: "Price must be a positive number.",
  }),
  costPrice: z.coerce
    .number()
    .min(0, {
      message: "Cost price must be a positive number.",
    })
    .optional(),
  quantity: z.coerce.number().int().min(0, {
    message: "Quantity must be a positive integer.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  vendor: z.string().optional(),
  weight: z.coerce
    .number()
    .min(0, {
      message: "Weight must be a positive number.",
    })
    .optional(),
  status: z.string().min(1, {
    message: "Please select a status.",
  }),
  image: z
    .any()
    .refine((t) => z.instanceof(FileList).safeParse(t).success)
    .optional(),
  tags: z.string().optional(),
});
