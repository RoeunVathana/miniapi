# MiniShopStore API Guide

## What this project teaches

MiniShopStore is a beginner-friendly NestJS REST API. It demonstrates:

- Modules, controllers, and services
- DTO validation with class-validator
- Product and user CRUD operations
- Query filtering
- E2E API testing with Supertest
- Basic API hardening with Helmet, throttling, and CORS

The API stores products and users in PostgreSQL through Prisma. A migration and seed script are included so a student can create the database from pgAdmin and inspect the tables.

## Run the project

```bash
npm install
npm run start:dev
```

Before starting, copy `.env.example` to `.env`, create a PostgreSQL database named `minishopstore` in pgAdmin, and set `DATABASE_URL` to the connection string.

```powershell
Copy-Item .env.example .env
npm run db:generate
npm run db:migrate:deploy
npm run db:seed
```

The API base URL is:

```text
http://localhost:3000/api
```

The deployed Railway API is:

```text
https://miniapi-production-3e1bc0d9.up.railway.app/api
```

Health check:

```text
https://miniapi-production-3e1bc0d9.up.railway.app/api/health
```

## OpenAPI JSON

The machine-readable OpenAPI document is `docs/minishopstore-api.json`. Import it into Swagger UI, Postman, or another API client. The client configuration example is `docs/deployment-config.example.json`.

Useful checks:

```bash
npm test
npm run build
```

## Security rules

- Helmet sends common security headers.
- Each client is limited to 100 requests per minute.
- JSON and form bodies are limited to 100 KB.
- CORS allows origins from `CORS_ORIGINS`.
- Product and user CRUD routes are public for classroom testing.
- Public user registration always creates an active customer.
- A client cannot self-assign the admin role during registration.

For production, set a long random value and do not commit it:

```powershell
$env:NODE_ENV="production"
$env:CORS_ORIGINS="https://your-frontend.example"
npm run start:prod
```

Warning: the API key guard is removed, so anyone who can reach the API can create, update, or delete records. Add JWT authentication and role authorization before using real customer data.

## Endpoint reference

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/health` | Public | Check service status |
| GET | `/api/products` | Public | List products |
| GET | `/api/products?category=home` | Public | Filter products |
| GET | `/api/products/:id` | Public | Get one product |
| POST | `/api/products` | Public | Create a product |
| PATCH | `/api/products/:id` | Public | Update a product |
| DELETE | `/api/products/:id` | Public | Delete a product |
| GET | `/api/users` | Public | List users |
| GET | `/api/users?role=admin` | Public | Filter users by role |
| GET | `/api/users/:id` | Public | Get one user |
| POST | `/api/users` | Public | Register a customer |
| PATCH | `/api/users/:id` | Public | Update a user |
| DELETE | `/api/users/:id` | Public | Delete a user |

## Request examples

## JSON keys by operation

All requests use JSON unless the method is a read-only `GET` request. Always send this header for JSON bodies:

```http
Content-Type: application/json
```

### Product insert: `POST /api/products`

| Key | Type | Required | Rules |
| --- | --- | --- | --- |
| `name` | string | Yes | 2-100 characters |
| `description` | string | No | Maximum 500 characters |
| `price` | number | Yes | 0-1,000,000; maximum 2 decimal places |
| `category` | string | Yes | 2-50 characters |
| `stock` | integer | Yes | 0-1,000,000 |
| `imageUrl` | URL string | No | Must be a valid URL |

Do not send `id`, `createdAt`, or `updatedAt` when inserting a product. Product insert is public in this classroom configuration.

### Product update: `PATCH /api/products/:id`

The body can contain any combination of the product keys above. All fields are optional, but at least one valid field should be sent.

### User insert: `POST /api/users`

| Key | Type | Required | Rules |
| --- | --- | --- | --- |
| `name` | string | Yes | 2-100 characters |
| `email` | email string | Yes | Must be a valid, unique email |

The API lowercases the email, assigns `role: "customer"`, and assigns `isActive: true`. Do not send `id`, `role`, `isActive`, `createdAt`, or `updatedAt` during public registration.

### User update: `PATCH /api/users/:id`

User update is public in this classroom configuration. Accepted optional keys are:

```json
{
  "name": "Updated Student",
  "email": "updated@example.com",
  "role": "customer",
  "isActive": true
}
```

### Query and path keys

| Location | Key | Example | Meaning |
| --- | --- | --- | --- |
| Path | `id` | `/products/1` | Numeric record ID |
| Query | `category` | `/products?category=home` | Filter products |
| Query | `role` | `/users?role=admin` | Filter users by `customer` or `admin` |

### Request process

1. Choose the route and HTTP method.
2. Add `/api` before the route when using the deployed URL.
3. Add `Content-Type: application/json` for POST and PATCH requests.
4. Send only the documented JSON keys.
5. Check the response status: `200` for reads/updates/deletes, `201` for inserts, `400` for validation, `404` for a missing record, and `409` for a duplicate email.

### Common 400 response

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "details": [
    {
      "field": "email",
      "messages": ["email must be an email"]
    }
  ]
}
```

### Create a product

```http
POST /api/products
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

### Register a customer

```http
POST /api/users
Content-Type: application/json

{
  "name": "Bob Student",
  "email": "bob@example.com"
}
```

The server lowercases the email, assigns the `customer` role, and sets `isActive` to `true`.

### Update a user as an admin

```http
PATCH /api/users/1
Content-Type: application/json

{
  "isActive": false,
  "role": "customer"
}
```

## Suggested lesson order

1. Read `src/main.ts` and `src/app.setup.ts`.
2. Follow a request into `ProductsController` or `UsersController`.
3. Move through the controller into the service.
4. Change a DTO validation rule and observe the HTTP 400 response.
5. Add a new route and write an e2e test for it.
6. Open the PostgreSQL tables in pgAdmin and compare them with the Prisma schema.

## Production roadmap

This project is intentionally public for classroom testing. A production application should add JWT or session authentication, hashed passwords, database-backed role authorization, secret management, audit logging, and HTTPS before allowing writes.
