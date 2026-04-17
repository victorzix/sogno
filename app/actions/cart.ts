'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// Obtém o carrinho atual
export async function getCart() {
  const session = await getSession();
  
  if (!session?.user?.id) {
    return null;
  }

  // Busca o carrinho do usuário logado
  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  });

  return cart;
}

// Cria um novo carrinho vazio para o usuário logado
export async function createCart() {
  const session = await getSession();
  
  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado");
  }

  const cart = await prisma.cart.create({
    data: {
      userId: session.user.id,
    },
  });

  return cart;
}

// Adiciona um item ao carrinho
export async function addToCart(productId: string, variantId?: string, quantity: number = 1) {
  const session = await getSession();
  if (!session?.user?.id) {
    return { success: false, error: 'Você precisa estar logado para adicionar itens ao carrinho' };
  }

  let cart = await getCart();

  if (!cart) {
    cart = await createCart();
  }

  // Verifica se o item já existe no carrinho
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
      variantId: variantId || null,
    },
  });

  if (existingItem) {
    // Atualiza a quantidade
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    // Cria novo item
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
        quantity,
      },
    });
  }

  // Atualiza o updatedAt do carrinho para resetar a contagem dos 5 dias
  await prisma.cart.update({
    where: { id: cart.id },
    data: { updatedAt: new Date() },
  });

  revalidatePath('/carrinho');
  return { success: true };
}

// Atualiza a quantidade de um item do carrinho
export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  const cart = await getCart();
  
  if (!cart) return { success: false, error: 'Carrinho não encontrado' };

  if (quantity <= 0) {
    return removeFromCart(cartItemId);
  }

  await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });

  // Atualiza o updatedAt do carrinho para resetar a contagem dos 5 dias
  await prisma.cart.update({
    where: { id: cart.id },
    data: { updatedAt: new Date() },
  });

  revalidatePath('/carrinho');
  return { success: true };
}

// Remove um item do carrinho
export async function removeFromCart(cartItemId: string) {
  const cart = await getCart();
  
  if (!cart) return { success: false, error: 'Carrinho não encontrado' };

  await prisma.cartItem.delete({
    where: { id: cartItemId },
  });

  // Atualiza o updatedAt do carrinho para resetar a contagem dos 5 dias
  await prisma.cart.update({
    where: { id: cart.id },
    data: { updatedAt: new Date() },
  });

  revalidatePath('/carrinho');
  return { success: true };
}

// Limpa todo o carrinho
export async function clearCart() {
  const cart = await getCart();
  
  if (!cart) return { success: true };

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  await prisma.cart.update({
    where: { id: cart.id },
    data: { updatedAt: new Date() },
  });

  revalidatePath('/carrinho');
  return { success: true };
}
