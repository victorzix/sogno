'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createTestProduct() {
  const slug = `caderno-test-${Date.now()}`;
  const product = await prisma.product.create({
    data: {
      name: 'Caderno Artesanal Clássico',
      slug,
      basePrice: 120.0,
      minQuantity: 1,
      imageUrls: [],
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
