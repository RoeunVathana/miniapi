import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      name: 'Wireless Headphones',
      description: 'Comfortable headphones for everyday listening.',
      price: 49.99,
      category: 'electronics',
      stock: 12,
      imageUrl: 'https://placehold.co/600x400?text=Headphones',
    },
    {
      name: 'Canvas Backpack',
      description: 'A light backpack for school and short trips.',
      price: 35,
      category: 'bags',
      stock: 8,
      imageUrl: 'https://placehold.co/600x400?text=Backpack',
    },
    {
      name: 'Ceramic Coffee Mug',
      description: 'A simple mug for coffee, tea, or hot chocolate.',
      price: 12.5,
      category: 'home',
      stock: 24,
      imageUrl: 'https://placehold.co/600x400?text=Mug',
    },
  ];

  for (const product of products) {
    const existingProduct = await prisma.product.findFirst({
      where: { name: product.name },
    });

    if (existingProduct) {
      await prisma.product.update({
        where: { id: existingProduct.id },
        data: product,
      });
    } else {
      await prisma.product.create({ data: product });
    }
  }

  await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      name: 'Alice Customer',
      email: 'alice@example.com',
      role: 'customer',
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      isActive: true,
    },
  });

  console.log('Database seed completed.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
