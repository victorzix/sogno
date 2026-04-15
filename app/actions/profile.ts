"use server";

import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/lib/schemas/profile";
import { revalidatePath } from "next/cache";

export async function updateProfile(userId: string, data: any) {
  const validation = profileSchema.safeParse(data);
  if (!validation.success) {
    const issue = validation.error.issues[0];
    return { error: issue.message, field: issue.path[0] };
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing && existing.id !== userId) {
      return { error: "Este email já está em uso", field: "email" };
    }

    await prisma.user.update({
      where: { id: userId },
      data: validation.data,
    });

    revalidatePath("/conta");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Erro ao atualizar perfil" };
  }
}
