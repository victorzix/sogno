import * as z from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(1, "Digite seu Email ou CPF"),
  password: z.string().min(1, "Digite sua senha"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  cpf: z.string().length(14, "CPF deve ter 11 dígitos"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});
