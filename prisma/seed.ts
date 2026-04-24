import { PrismaClient } from '../generated/client';
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";
import { slugify, withUniquePrefix } from "../lib/slug";

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

  // Imagens (Unsplash) — repete em ciclo. Após `migrate`, se o seed acusar campo desconhecido: `npx prisma generate`
  const unsplash = (id: string) =>
    `https://images.unsplash.com/${id}?w=800&h=1000&auto=format&fit=crop`;
  const UNSPLASH_IMAGES = [
    unsplash("photo-1544716278-ca5e3f4abd8c"),
    unsplash("photo-1506784365847-bbad939e9335"),
    unsplash("photo-1456513080510-7bf3a84b82f8"),
    unsplash("photo-1512820790803-83ca734da794"),
    unsplash("photo-1513542789411-b6a5d4f31634"),
    unsplash("photo-1586075010923-2dd4570fb338"),
    unsplash("photo-1513364776144-60967b0f800f"),
    unsplash("photo-1606112219348-204d7d8b94ee"),
    unsplash("photo-1553062407-98bab64c11cc"),
    unsplash("photo-1606107557195-0f29c4a3b3b0"),
    unsplash("photo-1507842217121-9d9a60d1e0d4"),
    unsplash("photo-1455390582262-044c0d003eab"),
    unsplash("photo-1452860606245-08befc0f44cc"),
  ];

  // Lista de produtos para o Sogni di Carta (Curadoria e Papelaria Artesanal)
  const products: {
    name: string;
    basePrice: number;
    description?: string;
    /** Ficha de produto: `default` (grid) ou `editorial` (exemplo alternativo) */
    theme?: string;
    variants: { name: string; price: number; description?: string; imageUrls?: string[] }[];
  }[] = [
    {
      name: 'Caderno Vellum Clássico',
      basePrice: 120.0,
      description:
        'Papel algodão com textura a roçar, pensado para escrever e guardar. Cada caderno é composto e revisto à mão, num ritmo lento, à altura de quem ainda gosta de abrir a capa e sentir o peso da página.',
      theme: 'editorial',
      variants: [
        {
          name: 'Páginas Lisas',
          price: 120.0,
          description:
            'Superfície contínua, ideal para desenho livre, notas e colagens. Sem ruído de linha — só o teu traço e o silêncio do papel.',
        },
        {
          name: 'Páginas Pautadas',
          price: 125.0,
          description: 'Pauta sutil, espacejada para caligrafia e letra corrida, sem apertar o gesto. Adequada a quem gosta de escrever com meio sítio.',
        },
        {
          name: 'Páginas Pontilhadas',
          price: 125.0,
          description:
            'Grelha de pontos discreta, polivalente: bullet journal, tabelas leves, traços técnicos. A estrutura está lá, quase invisível.',
        },
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

  const usedSlugs = new Set<string>();
  const nImg = UNSPLASH_IMAGES.length;
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const imageUrls = [
      UNSPLASH_IMAGES[i % nImg],
      UNSPLASH_IMAGES[(i + 1) % nImg],
      UNSPLASH_IMAGES[(i + 2) % nImg],
    ];
    const imageUrl = imageUrls[0];
    const baseSlug = slugify(p.name);
    const slug = withUniquePrefix(baseSlug, usedSlugs);
    const createdProduct = await prisma.product.create({
      data: {
        name: p.name,
        slug,
        imageUrl,
        imageUrls,
        basePrice: p.basePrice,
        categoryId: casamentoCategory.id,
        ...(p.description != null ? { description: p.description } : {}),
        ...(p.theme != null ? { theme: p.theme } : {}),
        variants: {
          create: p.variants.map((v, j) => ({
            name: v.name,
            price: v.price,
            ...(v.description != null ? { description: v.description } : {}),
            imageUrls:
              v.imageUrls ?? [
                UNSPLASH_IMAGES[(i + j + 3) % nImg],
                UNSPLASH_IMAGES[(i + j + 4) % nImg],
              ],
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
