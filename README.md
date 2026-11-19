# MiniShopStore API

A small NestJS REST API designed for teaching and testing. It uses PostgreSQL through Prisma, with pgAdmin as an optional database management tool. This keeps the lessons focused on NestJS modules, controllers, services, DTOs, validation, database queries, and HTTP testing.

## Run the API

```bash
npm install
npm run start:dev
```

For deployed testing, use `https://miniapi-production-3e1bc0d9.up.railway.app/api`. Local development uses `http://localhost:3000/api`.

## PostgreSQL and pgAdmin

1. In pgAdmin, create a PostgreSQL database named `minishopstore`.
2. Copy `.env.example` to `.env` and update `DATABASE_URL` with your PostgreSQL username and password.
3. Generate the Prisma client, create the tables, and insert the sample data:

```powershell
Copy-Item .env.example .env
npm run db:generate
npm run db:migrate -- --name init
npm run db:seed
```

The existing migration is also ready for a fresh database:

```bash
npm run db:migrate:deploy
```

To inspect the data, register the same PostgreSQL server in pgAdmin and open the `minishopstore` database. You can also use `npm run db:studio` for Prisma Studio.

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
- Product and user CRUD routes are public for classroom testing.
- Public user registration always creates an active `customer`; clients cannot self-assign `admin`.

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

## Deploy to Railway

1. Push this repository to GitHub.
2. In Railway, create a project and deploy the `RoeunVathana/miniapi` GitHub repository.
3. Add a PostgreSQL service to the same Railway project.
4. Add these variables to the API service:

```text
DATABASE_URL=${{Postgres.DATABASE_URL}}
NODE_ENV=production
CORS_ORIGINS=<your-frontend-origin>
```

`railway.json` runs the Prisma migrations and seed command before starting the API. Railway will health-check `/api/health`.

For production, use the database connection details from Railway in pgAdmin if you want to inspect the hosted database. Enable the database public connection only when needed and keep its credentials private.

## Security note

The API key guard has been removed to make classroom testing simple. This means anyone who can reach the API can create, update, or delete products and users. Do not use this public-write configuration for real customer data. The next teaching step is JWT authentication with hashed passwords and database-backed role authorization.
