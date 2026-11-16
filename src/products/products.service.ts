import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './interfaces/product.interface';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(category?: string) {
    const products = await this.prisma.product.findMany({
      where: category
        ? { category: { equals: category, mode: 'insensitive' } }
        : undefined,
      orderBy: { id: 'asc' },
    });

    return products.map((product) => this.toResponse(product));
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} was not found`);
    }

    return this.toResponse(product);
  }

  async create(createProductDto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        price: new Prisma.Decimal(createProductDto.price),
        category: createProductDto.category,
        stock: createProductDto.stock,
        imageUrl: createProductDto.imageUrl,
      },
    });

    return this.toResponse(product);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        name: updateProductDto.name,
        description: updateProductDto.description,
        price:
          updateProductDto.price === undefined
            ? undefined
            : new Prisma.Decimal(updateProductDto.price),
        category: updateProductDto.category,
        stock: updateProductDto.stock,
        imageUrl: updateProductDto.imageUrl,
      },
    });

    return this.toResponse(product);
  }

  async remove(id: number) {
    await this.findOne(id);
    const product = await this.prisma.product.delete({ where: { id } });
    return this.toResponse(product);
  }

  private toResponse(product: Prisma.ProductGetPayload<{}>): Product {
    return {
      id: product.id,
      name: product.name,
      description: product.description ?? undefined,
      price: Number(product.price),
      category: product.category,
      stock: product.stock,
      imageUrl: product.imageUrl ?? undefined,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }
}
