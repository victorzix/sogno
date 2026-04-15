"use server";

import { prisma } from "@/lib/prisma";
import { addressSchema } from "@/lib/schemas/address";
import { revalidatePath } from "next/cache";

export async function upsertAddress(userId: string, data: any) {
  const validation = addressSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  try {
    const address = await prisma.address.upsert({
      where: { userId },
      update: validation.data,
      create: { ...validation.data, userId },
    });

    revalidatePath("/conta");
    return { success: true, address };
  } catch (err) {
    console.error(err);
    return { error: "Erro ao salvar endereço" };
  }
}

export async function getAddress(userId: string) {
  return await prisma.address.findUnique({
    where: { userId },
  });
}
