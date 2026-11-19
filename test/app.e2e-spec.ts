import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { PrismaService } from '../src/database/prisma.service';
import { createPrismaMock } from './prisma.mock';

describe('MiniShopStore API (e2e)', () => {
  let app: INestApplication;
  const prismaMock = createPrismaMock();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    app = moduleFixture.createNestApplication({ bodyParser: false });
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/health returns the service status', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect(({ body }) => {
        expect(body.status).toBe('ok');
        expect(body.service).toBe('minishopstore-api');
      });
  });

  it('GET /api/products returns seeded products', () => {
    return request(app.getHttpServer())
      .get('/api/products')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveLength(3);
        expect(body[0]).toHaveProperty('name', 'Wireless Headphones');
      });
  });

  it('POST /api/products validates input and creates a product', () => {
    return request(app.getHttpServer())
      .post('/api/products')
      .send({
        name: 'Desk Lamp',
        description: 'A small lamp for a study desk.',
        price: 22.99,
        category: 'home',
        stock: 10,
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          id: 4,
          name: 'Desk Lamp',
          price: 22.99,
          category: 'home',
          stock: 10,
        });
        expect(body).toHaveProperty('createdAt');
      });
  });

  it('POST /api/products rejects invalid input with field details', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/products')
      .send({ name: 'X', price: -1, category: 'home', stock: -5 });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(response.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'price' }),
        expect.objectContaining({ field: 'stock' }),
      ]),
    );
  });

  it('GET /api/products/:id returns 404 for an unknown product', () => {
    return request(app.getHttpServer()).get('/api/products/999').expect(404);
  });

  it('GET /api/users returns seeded users', () => {
    return request(app.getHttpServer())
      .get('/api/users')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveLength(2);
        expect(body[0]).toMatchObject({
          name: 'Alice Customer',
          email: 'alice@example.com',
          role: 'customer',
        });
      });
  });

  it('POST /api/users creates a customer and lowercases the email', () => {
    return request(app.getHttpServer())
      .post('/api/users')
      .send({ name: 'Bob Student', email: 'BOB@example.com' })
      .expect(201)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          id: 3,
          name: 'Bob Student',
          email: 'bob@example.com',
          role: 'customer',
          isActive: true,
        });
      });
  });

  it('POST /api/users rejects duplicate emails', () => {
    return request(app.getHttpServer())
      .post('/api/users')
      .send({ name: 'Another Alice', email: 'ALICE@example.com' })
      .expect(409);
  });

  it('POST /api/products is public when the admin key is removed', () => {
    return request(app.getHttpServer())
      .post('/api/products')
      .send({ name: 'Unsafe Product', price: 10, category: 'home', stock: 1 })
      .expect(201);
  });

  it('POST /api/users rejects self-assigned admin roles', () => {
    return request(app.getHttpServer())
      .post('/api/users')
      .send({
        name: 'Unsafe Admin',
        email: 'unsafe@example.com',
        role: 'admin',
      })
      .expect(400);
  });
});
