import * as z from "zod";

export const addressSchema = z.object({
  zipCode: z.string().min(8, "CEP inválido").max(9, "CEP inválido"),
  street: z.string().min(3, "Logradouro é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, "Bairro é obrigatório"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().length(2, "UF deve ter 2 caracteres"),
});
