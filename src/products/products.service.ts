import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './interfaces/product.interface';

@Injectable()
export class ProductsService {
  private nextId = 4;

  private readonly products: Product[] = [
    {
      id: 1,
      name: 'Wireless Headphones',
      description: 'Comfortable headphones for everyday listening.',
      price: 49.99,
      category: 'electronics',
      stock: 12,
      imageUrl: 'https://placehold.co/600x400?text=Headphones',
      createdAt: '2026-01-10T08:00:00.000Z',
      updatedAt: '2026-01-10T08:00:00.000Z',
    },
    {
      id: 2,
      name: 'Canvas Backpack',
      description: 'A light backpack for school and short trips.',
      price: 35,
      category: 'bags',
      stock: 8,
      imageUrl: 'https://placehold.co/600x400?text=Backpack',
      createdAt: '2026-01-11T08:00:00.000Z',
      updatedAt: '2026-01-11T08:00:00.000Z',
    },
    {
      id: 3,
      name: 'Ceramic Coffee Mug',
      description: 'A simple mug for coffee, tea, or hot chocolate.',
      price: 12.5,
      category: 'home',
      stock: 24,
      imageUrl: 'https://placehold.co/600x400?text=Mug',
      createdAt: '2026-01-12T08:00:00.000Z',
      updatedAt: '2026-01-12T08:00:00.000Z',
    },
  ];

  findAll(category?: string) {
    if (!category) {
      return this.products;
    }

    return this.products.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase(),
    );
  }

  findOne(id: number) {
    const product = this.products.find((item) => item.id === id);

    if (!product) {
      throw new NotFoundException(`Product with id ${id} was not found`);
    }

    return product;
  }

  create(createProductDto: CreateProductDto) {
    const now = new Date().toISOString();
    const product: Product = {
      id: this.nextId++,
      ...createProductDto,
      createdAt: now,
      updatedAt: now,
    };

    this.products.push(product);
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    const product = this.findOne(id);
    Object.assign(product, updateProductDto, {
      updatedAt: new Date().toISOString(),
    });

    return product;
  }

  remove(id: number) {
    const productIndex = this.products.findIndex((item) => item.id === id);

    if (productIndex === -1) {
      throw new NotFoundException(`Product with id ${id} was not found`);
    }

    const [deletedProduct] = this.products.splice(productIndex, 1);
    return deletedProduct;
  }
}
