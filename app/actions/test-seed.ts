'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createTestProduct() {
  const product = await prisma.product.create({
    data: {
      name: 'Caderno Artesanal Clássico',
      basePrice: 120.00,
      minQuantity: 1,
    },
  });

  await prisma.productVariant.create({
    data: {
      productId: product.id,
      name: 'Páginas Pautadas',
      price: 120.00,
    }
  });

  await prisma.productVariant.create({
    data: {
      productId: product.id,
      name: 'Páginas Lisas',
      price: 110.00,
    }
  });

  revalidatePath('/catalogo');
  return { success: true };
}
