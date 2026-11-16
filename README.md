# MiniShopStore API

A small NestJS REST API designed for teaching and testing. It currently uses an in-memory array, so restarting the server resets the products. This keeps the first lesson focused on NestJS modules, controllers, services, DTOs, validation, and HTTP testing.

## Run the API

```bash
npm install
npm run start:dev
```

The API is available at `http://localhost:3000/api`.

## Endpoints

| Method | URL | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Check that the API is running |
| GET | `/api/products` | List all products |
| GET | `/api/products?category=home` | Filter products by category |
| GET | `/api/products/:id` | Get one product |
| POST | `/api/products` | Create a product |
| PATCH | `/api/products/:id` | Update any product fields |
| DELETE | `/api/products/:id` | Delete a product |
| GET | `/api/users` | List all users |
| GET | `/api/users?role=admin` | Filter users by role |
| GET | `/api/users/:id` | Get one user |
| POST | `/api/users` | Create a user |
| PATCH | `/api/users/:id` | Update a user |
| DELETE | `/api/users/:id` | Delete a user |

## Example request

```json
POST /api/products
x-api-key: local-teaching-key
Content-Type: application/json

{
  "name": "Mechanical Keyboard",
  "description": "A keyboard for a comfortable workspace.",
  "price": 79.99,
  "category": "electronics",
  "stock": 15,
  "imageUrl": "https://example.com/keyboard.jpg"
}
```

`name`, `price`, `category`, and `stock` are required. Extra fields are rejected by the global validation pipe.

## User example

```json
POST /api/users
Content-Type: application/json

{
  "name": "Bob Student",
  "email": "bob@example.com"
}
```

User emails are normalized to lowercase and must be unique. Authentication and passwords are intentionally left for a later lesson.

## Security

- Helmet adds common security headers.
- Requests are limited to 100 per minute per client.
- JSON and form bodies are limited to 100 KB.
- CORS allows only the origins in `CORS_ORIGINS`.
- Product creation, updates, and deletes require the `x-api-key` header.
- User updates and deletes require the `x-api-key` header.
- Public user registration always creates an active `customer`; clients cannot self-assign `admin`.

For local teaching, the default admin key is `local-teaching-key`. Set a strong `ADMIN_API_KEY` before production and never commit it to Git. Example protected request:

```http
POST /api/products
x-api-key: local-teaching-key
Content-Type: application/json
```

## Test the API

```bash
npm run test:e2e
npm run build
```

## Suggested student lesson order

1. Start with `src/main.ts` and learn the global prefix and validation pipe.
2. Follow the request into `ProductsController`.
3. Move the business logic into `ProductsService`.
4. Experiment with the DTO validation rules.
5. Run the e2e tests, then add a new endpoint or product field.

## Next step: database

When the class is ready, replace the array in `ProductsService` with a database repository (for example, PostgreSQL with Prisma or TypeORM). The controller and DTO concepts can remain mostly the same.
