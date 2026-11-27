# Tech-eShop

Tech-eShop is a full-stack e-commerce application built as a final project for the Coding Factory program at the Athens University of Economics and Business. It includes a customer storefront, a store administration dashboard, and a REST API.

**Author:** Γιώργος Τζεμπελίκος

[Live storefront](https://coding-factory-fe-tech-eshop.vercel.app/) · [Swagger API documentation](https://coding-factory-fe-tech-eshop.onrender.com/api-docs/)

## Customer storefront

- Browse products, search by name, filter by category, and view product details.
- Create an account, sign in, and update your profile.
- Add products to the cart, review the order summary, and place an order.
- Open **My Orders** (`/orders`) to see your order history, items, totals, and current status.

## Store administration

Sign in with an account that has the `ADMIN` role and select **Διαχείριση καταστήματος** from the account menu, or open `/admin`.

| Area | Available actions |
| --- | --- |
| Catalog | Create and edit products. Search by name and filter by category, status, or availability. |
| Product lifecycle | Save products as drafts, publish them, archive them, or restore them as drafts. Permanently delete archived products after confirmation. |
| Inventory | Update stock per product and see how many active products have fewer than five units. |
| Orders | View all orders and update their status to pending, completed, or cancelled. |
| Sales analytics | View order counts and the value of completed orders, with a monthly breakdown for the last six months. |

Only active products appear in the public catalog. Existing products without a stored status are treated as active. At checkout, the API checks that the products in the cart are still active. Inventory updates are manual. Sales figures reflect recorded order totals.

## Technology stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router, Context API, Zod |
| Backend | Node.js, Express, JavaScript, JWT authentication and role-based authorization |
| Database | MongoDB, Mongoose |
| API documentation and tests | Swagger UI, Jest |
| Deployment | Vercel for the frontend, Render for the backend |

## Run locally

### Prerequisites

- Git, Node.js 22.12 or later, and npm
- A MongoDB database and a connection string

### 1. Clone the repository

```sh
git clone https://github.com/gtzempe/CODING-FACTORY-FE-TECH-ESHOP.git
cd CODING-FACTORY-FE-TECH-ESHOP
```

### 2. Start the backend

Create `backend/.env` and set your own values:

```dotenv
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_signing_secret
```

From the repository root, run:

```sh
cd backend
npm ci
node --env-file=.env --watch server.js
```

The API listens on `http://localhost:3000` by default. Keep this terminal open.

### 3. Start the frontend

Create `frontend/.env`:

```dotenv
VITE_API_URL=http://localhost:3000/api
```

In a second terminal, from the repository root, run:

```sh
cd frontend
npm ci
npm run dev
```

On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`.

| Page | Local URL |
| --- | --- |
| Storefront | <http://localhost:5173> |
| Store administration | <http://localhost:5173/admin> |
| My Orders | <http://localhost:5173/orders> |
| Swagger UI | <http://localhost:3000/api-docs> |

To test administration locally, use an account with the `ADMIN` role in your development database. Sign in again after changing an account's role so the application receives a fresh token.

## API examples

Protected endpoints expect an `Authorization: Bearer <token>` header.

| Method | Endpoint | Purpose | Access |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Register an account | Public |
| `POST` | `/api/auth/login` | Sign in and receive a JWT | Public |
| `GET` | `/api/products` | List active products | Public |
| `GET` | `/api/products/:id` | View an active product | Public |
| `GET` | `/api/products/admin` | List products in all statuses | Admin |
| `POST` | `/api/products` | Create a product | Admin |
| `PUT` | `/api/products/:id` | Update product details, stock, or status | Admin |
| `DELETE` | `/api/products/:id` | Permanently delete a product | Admin |
| `GET` | `/api/users/me` | Get the signed-in user's profile | Signed in |
| `POST` | `/api/orders` | Place an order | Signed in |
| `GET` | `/api/orders/me` | List the signed-in user's orders | Signed in |
| `GET` | `/api/orders` | List all orders | Admin |
| `PUT` | `/api/orders/:id` | Update an order's status | Admin |

## Project structure

- `frontend/src/pages/` — storefront, checkout, customer order history, and admin dashboard
- `frontend/src/components/` — shared UI and catalog management components
- `frontend/src/api/` — API client functions
- `backend/routes/` and `backend/controllers/` — API routes and HTTP handlers
- `backend/services/`, `backend/dao/`, and `backend/models/` — application logic, database access, and schemas
- `backend/middlewares/` — authentication and authorization
- `backend/tests/` — Jest tests

## Tests and production build

Run the catalog and order management tests from `backend/`. These tests can run without a live MongoDB connection.

```sh
npm test -- --runInBand --coverage=false tests/catalog-management.test.js tests/order-management.test.js
```

For the full backend suite, set `MONGODB_URI` to a dedicated **test database** and provide `JWT_SECRET`. The integration tests create, update, and delete records. Then run `npm test -- --runInBand` from `backend/`.

Create a production build from `frontend/`:

```sh
npm run build
```

## Screenshots

### Storefront home

![Storefront home with product categories and featured products](docs/main%20page.png)

### Product catalog

![Storefront product catalog with search and product cards](docs/products%20page.png)

### Admin dashboard

![Admin dashboard with order metrics and a monthly sales chart](docs/store%20management.png)

### Catalog and inventory management

![Admin product list with filters, stock controls, and product actions](docs/store%20management2.png)

### Add a product

![Admin form for creating a product](docs/Add%20new%20product.png)

### Order management

![Admin order list with controls for updating order status](docs/store%20management-orders.png)
