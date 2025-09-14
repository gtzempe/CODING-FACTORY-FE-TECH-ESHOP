const m2s = require("mongoose-to-swagger");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");

exports.options = {
  openapi: "3.1.0",
  info: {
    version: "1.0.0",
    title: "eShop API",
    description:
      "Final project API for users, products, orders, and authentication",
    contact: {
      name: "Coding Factory Support",
      email: "support@codingfactory.gr",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local Server",
    },
  ],
  components: {
    schemas: {
      User: m2s(User),
      Product: m2s(Product),
      Order: m2s(Order),
      UserInput: {
        type: "object",
        required: ["username", "password", "email"],
        properties: {
          username: { type: "string" },
          password: { type: "string" },
          name: { type: "string" },
          surname: { type: "string" },
          email: { type: "string" },
          address: {
            type: "object",
            properties: {
              area: { type: "string" },
              road: { type: "string" },
            },
          },
          phone: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: { type: "string" },
                number: { type: "string" },
              },
            },
          },
        },
      },
      ProductInput: {
        type: "object",
        required: ["product", "description", "category", "price", "stock"],
        properties: {
          product: { type: "string" },
          description: { type: "string" },
          category: { type: "string" },
          image: { type: "string" },
          price: { type: "number" },
          stock: { type: "number" },
        },
      },
      OrderInput: {
        type: "object",
        required: ["items", "shippingAddress", "totalCost"],
        properties: {
          items: {
            type: "array",
            items: {
              type: "object",
              required: ["product", "quantity", "price"],
              properties: {
                product: { type: "string" },
                quantity: { type: "number" },
                price: { type: "number" },
              },
            },
          },
          shippingAddress: {
            type: "object",
            properties: {
              road: { type: "string" },
              area: { type: "string" },
            },
          },
          totalCost: { type: "number" },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  tags: [
    { name: "Auth", description: "Authentication" },
    { name: "Me", description: "User self-service endpoints" },
    { name: "Users", description: "CRUD operations for users" },
    { name: "Products", description: "CRUD operations for products" },
    { name: "Orders", description: "Order management" },
  ],
  paths: {
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user and receive JWT",
        security: [], // public
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "password"],
                properties: {
                  username: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "JWT token returned" },
          400: { description: "Bad request" },
          401: { description: "Unauthorized" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        security: [], // public
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserInput" },
            },
          },
        },
        responses: {
          201: { description: "User created" },
          400: { description: "Bad request" },
          409: { description: "Email already exists" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "Get all users (ADMIN only)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Array of users",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/User" },
                },
              },
            },
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
          500: { description: "Server error" },
        },
      },
      post: {
        tags: ["Users"],
        summary: "Create a user (ADMIN only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserInput" },
            },
          },
        },
        responses: {
          201: { description: "User created" },
          400: { description: "Bad request" },
          401: { description: "Unauthorized" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/users/{username}": {
      get: {
        tags: ["Users"],
        summary: "Get a user by username (ADMIN only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "username",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "User found" },
          401: { description: "Unauthorized" },
          404: { description: "User not found" },
          500: { description: "Server error" },
        },
      },
      put: {
        tags: ["Users"],
        summary: "Update a user by username (ADMIN only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "username",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserInput" },
            },
          },
        },
        responses: {
          200: { description: "User updated" },
          400: { description: "Bad request" },
          401: { description: "Unauthorized" },
          404: { description: "User not found" },
          500: { description: "Server error" },
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Delete a user by username (ADMIN only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "username",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "User deleted" },
          401: { description: "Unauthorized" },
          404: { description: "User not found" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/users/me": {
      get: {
        tags: ["Me"],
        summary: "Get my own user profile",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "User profile returned" },
          401: { description: "Unauthorized" },
          500: { description: "Server error" },
        },
      },
      put: {
        tags: ["Me"],
        summary: "Update my own user profile",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserInput" },
            },
          },
        },
        responses: {
          200: { description: "User profile updated" },
          400: { description: "Bad request" },
          401: { description: "Unauthorized" },
          500: { description: "Server error" },
        },
      },
      delete: {
        tags: ["Me"],
        summary: "Delete my own user account",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "User deleted" },
          401: { description: "Unauthorized" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/products": {
      get: {
        tags: ["Products"],
        summary: "Get all products",
        security: [], // public
        responses: {
          200: {
            description: "Array of products",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Product" },
                },
              },
            },
          },
          500: { description: "Server error" },
        },
      },
      post: {
        tags: ["Products"],
        summary: "Create a new product (ADMIN only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductInput" },
            },
          },
        },
        responses: {
          201: { description: "Product created" },
          400: { description: "Bad request" },
          401: { description: "Unauthorized" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get product by ID",
        security: [], // public
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Product found" },
          404: { description: "Product not found" },
          500: { description: "Server error" },
        },
      },
      put: {
        tags: ["Products"],
        summary: "Update product by ID (ADMIN only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductInput" },
            },
          },
        },
        responses: {
          200: { description: "Product updated" },
          400: { description: "Bad request" },
          404: { description: "Product not found" },
          500: { description: "Server error" },
        },
      },
      delete: {
        tags: ["Products"],
        summary: "Delete product by ID (ADMIN only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Product deleted" },
          404: { description: "Product not found" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/orders": {
      get: {
        tags: ["Orders"],
        summary: "Get all orders (ADMIN only)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Array of orders",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Order" },
                },
              },
            },
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
          500: { description: "Server error" },
        },
      },
      post: {
        tags: ["Orders"],
        summary: "Create a new order",
        security: [{ bearerAuth: [] }], // logged-in user
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/OrderInput" },
            },
          },
        },
        responses: {
          201: { description: "Order created" },
          400: { description: "Bad request" },
          401: { description: "Unauthorized" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/orders/{id}": {
      get: {
        tags: ["Orders"],
        summary: "Get order by ID (ADMIN only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Order found" },
          404: { description: "Order not found" },
          500: { description: "Server error" },
        },
      },
      delete: {
        tags: ["Orders"],
        summary: "Delete order by ID (ADMIN only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Order deleted" },
          404: { description: "Order not found" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/orders/me": {
      get: {
        tags: ["Me"],
        summary: "Get my own orders",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Array of user orders",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Order" },
                },
              },
            },
          },
          401: { description: "Unauthorized" },
          500: { description: "Server error" },
        },
      },
    },
  },
};
