import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(1, "Nome do produto é obrigatório"),
  basePrice: z.coerce.number().positive("Preço base deve ser positivo"),
  minQuantity: z.coerce.number().int().positive().default(1),
  variants: z
    .array(
      z.object({
        name: z.string().min(1, "Nome da variante é obrigatório"),
        price: z.coerce.number().positive().optional().nullable(),
      })
    )
    .optional(),
  discounts: z
    .array(
      z.object({
        quantityThreshold: z.coerce.number().int().positive("Quantidade deve ser positiva"),
        discountPercent: z.coerce.number().positive("Desconto deve ser positivo"),
      })
    )
    .optional(),
});

export type ProductInput = z.infer<typeof ProductSchema>;
