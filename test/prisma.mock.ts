import { Prisma } from '@prisma/client';
import { PrismaService } from '../src/database/prisma.service';
import { UserRole } from '../src/users/interfaces/user.interface';

type ProductRow = {
  id: number;
  name: string;
  description: string | null;
  price: Prisma.Decimal;
  category: string;
  stock: number;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type UserRow = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function now() {
  return new Date('2026-01-10T08:00:00.000Z');
}

export function createPrismaMock() {
  const products: ProductRow[] = [
    {
      id: 1,
      name: 'Wireless Headphones',
      description: 'Comfortable headphones for everyday listening.',
      price: new Prisma.Decimal(49.99),
      category: 'electronics',
      stock: 12,
      imageUrl: 'https://placehold.co/600x400?text=Headphones',
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 2,
      name: 'Canvas Backpack',
      description: 'A light backpack for school and short trips.',
      price: new Prisma.Decimal(35),
      category: 'bags',
      stock: 8,
      imageUrl: 'https://placehold.co/600x400?text=Backpack',
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 3,
      name: 'Ceramic Coffee Mug',
      description: 'A simple mug for coffee, tea, or hot chocolate.',
      price: new Prisma.Decimal(12.5),
      category: 'home',
      stock: 24,
      imageUrl: 'https://placehold.co/600x400?text=Mug',
      createdAt: now(),
      updatedAt: now(),
    },
  ];

  const users: UserRow[] = [
    {
      id: 1,
      name: 'Alice Customer',
      email: 'alice@example.com',
      role: 'customer',
      isActive: true,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 2,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      isActive: true,
      createdAt: now(),
      updatedAt: now(),
    },
  ];

  const product = {
    findMany: jest.fn(
      async (args?: { where?: { category?: { equals: string } } }) => {
        const category = args?.where?.category?.equals?.toLowerCase();
        return category
          ? products.filter((item) => item.category.toLowerCase() === category)
          : products;
      },
    ),
    findUnique: jest.fn(
      async (args: { where: { id: number } }) =>
        products.find((item) => item.id === args.where.id) ?? null,
    ),
    create: jest.fn(
      async (args: {
        data: Omit<ProductRow, 'id' | 'createdAt' | 'updatedAt'>;
      }) => {
        const timestamp = new Date();
        const created = {
          id: products.length + 1,
          ...args.data,
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        products.push(created);
        return created;
      },
    ),
    update: jest.fn(
      async (args: { where: { id: number }; data: Partial<ProductRow> }) => {
        const existing = products.find((item) => item.id === args.where.id);
        if (!existing) throw new Error('Product not found');
        for (const [key, value] of Object.entries(args.data)) {
          if (value !== undefined) {
            (existing as unknown as Record<string, unknown>)[key] = value;
          }
        }
        existing.updatedAt = new Date();
        return existing;
      },
    ),
    delete: jest.fn(async (args: { where: { id: number } }) => {
      const index = products.findIndex((item) => item.id === args.where.id);
      if (index === -1) throw new Error('Product not found');
      return products.splice(index, 1)[0];
    }),
  };

  const user = {
    findMany: jest.fn(async (args?: { where?: { role?: UserRole } }) => {
      const role = args?.where?.role;
      return role ? users.filter((item) => item.role === role) : users;
    }),
    findUnique: jest.fn(
      async (args: { where: { id?: number; email?: string } }) =>
        users.find(
          (item) =>
            (args.where.id !== undefined && item.id === args.where.id) ||
            (args.where.email !== undefined && item.email === args.where.email),
        ) ?? null,
    ),
    create: jest.fn(
      async (args: {
        data: Omit<UserRow, 'id' | 'createdAt' | 'updatedAt'>;
      }) => {
        const timestamp = new Date();
        const created = {
          id: users.length + 1,
          ...args.data,
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        users.push(created);
        return created;
      },
    ),
    update: jest.fn(
      async (args: { where: { id: number }; data: Partial<UserRow> }) => {
        const existing = users.find((item) => item.id === args.where.id);
        if (!existing) throw new Error('User not found');
        for (const [key, value] of Object.entries(args.data)) {
          if (value !== undefined) {
            (existing as unknown as Record<string, unknown>)[key] = value;
          }
        }
        existing.updatedAt = new Date();
        return existing;
      },
    ),
    delete: jest.fn(async (args: { where: { id: number } }) => {
      const index = users.findIndex((item) => item.id === args.where.id);
      if (index === -1) throw new Error('User not found');
      return users.splice(index, 1)[0];
    }),
  };

  return { product, user } as unknown as PrismaService;
}
