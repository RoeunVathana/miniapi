# MiniShopStore API Guide

## What this project teaches

MiniShopStore is a beginner-friendly NestJS REST API. It demonstrates:

- Modules, controllers, and services
- DTO validation with class-validator
- Product and user CRUD operations
- Query filtering
- E2E API testing with Supertest
- Basic API hardening with Helmet, throttling, CORS, and an admin API key

The current data store is an in-memory array. Restarting the server resets the sample data.

## Run the project

```bash
npm install
npm run start:dev
```

The API base URL is:

```text
http://localhost:3000/api
```

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
- Product POST, PATCH, and DELETE routes require `x-api-key`.
- User PATCH and DELETE routes require `x-api-key`.
- Public user registration always creates an active customer.
- A client cannot self-assign the admin role during registration.

For local teaching, the fallback key is:

```text
local-teaching-key
```

For production, set a long random value and do not commit it:

```powershell
$env:NODE_ENV="production"
$env:ADMIN_API_KEY="replace-with-a-long-random-value"
$env:CORS_ORIGINS="https://your-frontend.example"
npm run start:prod
```

## Endpoint reference

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/health` | Public | Check service status |
| GET | `/api/products` | Public | List products |
| GET | `/api/products?category=home` | Public | Filter products |
| GET | `/api/products/:id` | Public | Get one product |
| POST | `/api/products` | Admin key | Create a product |
| PATCH | `/api/products/:id` | Admin key | Update a product |
| DELETE | `/api/products/:id` | Admin key | Delete a product |
| GET | `/api/users` | Public | List users |
| GET | `/api/users?role=admin` | Public | Filter users by role |
| GET | `/api/users/:id` | Public | Get one user |
| POST | `/api/users` | Public | Register a customer |
| PATCH | `/api/users/:id` | Admin key | Update a user |
| DELETE | `/api/users/:id` | Admin key | Delete a user |

## Request examples

### Create a product

```http
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
x-api-key: local-teaching-key
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
5. Remove the API key and observe the HTTP 401 response.
6. Add a new route and write an e2e test for it.
7. Replace the in-memory arrays with a database when the class is ready.

## Production roadmap

This project intentionally uses a simple teaching key. A production application should add JWT or session authentication, hashed passwords, a database, role-based authorization, secret management, audit logging, and HTTPS.
