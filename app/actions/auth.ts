"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { cookies } from "next/headers";
import { encrypt } from "@/lib/auth";

const RegisterSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  cpf: z.string().length(11, "CPF deve ter 11 dígitos"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

const LoginSchema = z.object({
  identifier: z.string().min(1, "Digite seu Email ou CPF"),
  password: z.string().min(1, "Digite sua senha"),
});

export async function registerUser(data: any) {
  const validation = RegisterSchema.safeParse(data);
  if (!validation.success) {
    const issue = validation.error.issues[0];
    return { 
      error: issue.message, 
      field: issue.path[0] 
    };
  }

  const { name, email, cpf, password } = validation.data;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { cpf }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return { error: "Este email já está cadastrado", field: "email" };
      }
      return { error: "Este CPF já está cadastrado", field: "cpf" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        cpf,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
      },
    };
  } catch (err) {
    console.error(err);
    return { error: "Erro ao criar usuário" };
  }
}

export async function loginUser(data: any) {
  const validation = LoginSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const { identifier, password } = validation.data;

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { cpf: identifier }],
      },
    });

    if (!user) {
      return { error: "Credenciais inválidas" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { error: "Credenciais inválidas" };
    }

    // Criar sessão
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await encrypt({ user: { id: user.id, name: user.name, email: user.email }, expires });

    (await cookies()).set("session", session, { expires, httpOnly: true });

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
      },
    };
  } catch (err) {
    console.error(err);
    return { error: "Erro ao realizar login" };
  }
}
