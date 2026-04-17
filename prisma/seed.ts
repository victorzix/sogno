import { PrismaClient } from '../generated/client';
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando o seed do banco de dados...');

  // Limpa os dados existentes (opcional, remova se não quiser apagar o que já tem)
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const casamentoCategory = await prisma.category.create({
    data: {
      name: 'Casamento',
    }
  });

  console.log(`Categoria criada: ${casamentoCategory.name}`);

  // Lista de produtos para o Sogni di Carta (Curadoria e Papelaria Artesanal)
  const products = [
    {
      name: 'Caderno Vellum Clássico',
      basePrice: 120.0,
      variants: [
        { name: 'Páginas Lisas', price: 120.0 },
        { name: 'Páginas Pautadas', price: 125.0 },
        { name: 'Páginas Pontilhadas', price: 125.0 },
      ],
    },
    {
      name: 'Planner Minimalista 2026',
      basePrice: 150.0,
      variants: [
        { name: 'Tamanho A5', price: 150.0 },
        { name: 'Tamanho B5', price: 180.0 },
      ],
    },
    {
      name: 'Álbum de Viagem Artesanal',
      basePrice: 220.0,
      variants: [
        { name: 'Capa de Couro Rústico', price: 220.0 },
        { name: 'Capa de Linho Natural', price: 195.0 },
      ],
    },
    {
      name: 'Diário de Leitura',
      basePrice: 95.0,
      variants: [
        { name: 'Capa Dura', price: 95.0 },
        { name: 'Capa Flexível', price: 75.0 },
      ],
    },
    {
      name: 'Conjunto de Canetas Nanquim',
      basePrice: 85.0,
      variants: [
        { name: 'Tinta Preta Clássica', price: 85.0 },
        { name: 'Tinta Azul Escuro', price: 85.0 },
        { name: 'Tinta Sépia', price: 90.0 },
      ],
    },
    {
      name: 'Papel de Carta Texturizado',
      basePrice: 65.0,
      variants: [
        { name: 'Tom Branco Puro', price: 65.0 },
        { name: 'Tom Creme', price: 65.0 },
        { name: 'Tom Papiro Envelhecido', price: 70.0 },
      ],
    },
    {
      name: 'Sketchbook para Aquarela',
      basePrice: 140.0,
      variants: [
        { name: 'Papel 140g (Estudos)', price: 140.0 },
        { name: 'Papel 300g (Profissional)', price: 210.0 },
      ],
    },
    {
      name: 'Kit de Sinete e Cera',
      basePrice: 110.0,
      variants: [
        { name: 'Cera Vermelha Clássica', price: 110.0 },
        { name: 'Cera Dourada Ouro Velho', price: 115.0 },
      ],
    },
    {
      name: 'Estojo de Lona Encerada',
      basePrice: 75.0,
      variants: [
        { name: 'Cor Bege Areia', price: 75.0 },
        { name: 'Cor Verde Musgo', price: 75.0 },
        { name: 'Cor Azul Marinho', price: 75.0 },
      ],
    },
    {
      name: 'Caderneta de Bolso Sogni',
      basePrice: 45.0,
      variants: [
        { name: 'Sem Pauta (Liso)', price: 45.0 },
        { name: 'Pautado', price: 48.0 },
      ],
    },
  ];

  for (const p of products) {
    const createdProduct = await prisma.product.create({
      data: {
        name: p.name,
        basePrice: p.basePrice,
        categoryId: casamentoCategory.id,
        variants: {
          create: p.variants.map((v) => ({
            name: v.name,
            price: v.price,
          })),
        },
      },
    });
    console.log(`Produto criado: ${createdProduct.name}`);
  }

  console.log('Seed finalizado com sucesso! 🌱');
}

main()
  .catch((e) => {
    console.error('Erro ao executar o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
