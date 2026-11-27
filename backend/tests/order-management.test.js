const router = require("../routes/order.route");
const auth = require("../services/auth.service");
const orderDAO = require("../dao/order.dao");
const productDAO = require("../dao/product.dao");

jest.mock("../dao/order.dao");
jest.mock("../dao/product.dao");
jest.mock("../utils/logger", () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

const userId = "0123456789abcdef01234567";
const orderId = "abcdef0123456789abcdef01";
const order = {_id: orderId, userId, username: "customer", status: "pending"};

async function runRoute(method, path, roles, body) {
  const {route} = router.stack.find(layer => layer.route?.path === path && layer.route.methods[method]);
  const handlers = route.stack.map(layer => layer.handle);
  const token = auth.generateAccessToken({_id: userId, username: "customer", roles});
  const req = {headers: {authorization: "Bearer " + token}, params: {id: orderId}, body};
  const res = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(value) {
      this.body = value;
      return this;
    },
  };
  for (const handler of handlers) {
    let proceed = false;
    await handler(req, res, () => { proceed = true; });
    if (!proceed) break;
  }
  return res;
}

const originalSecret = process.env.JWT_SECRET;

beforeAll(() => {
  process.env.JWT_SECRET = "order-management-test-only";
});

afterAll(() => {
  if (originalSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = originalSecret;
});

beforeEach(() => jest.resetAllMocks());

test("customers only request orders associated with their token identity", async () => {
  orderDAO.findOrdersByUserId.mockResolvedValue([order]);

  const response = await runRoute("get", "/me", ["READER"]);

  expect(response.statusCode).toBe(200);
  expect(response.body.data).toEqual([expect.objectContaining({id: orderId, status: "pending"})]);
  expect(orderDAO.findOrdersByUserId).toHaveBeenCalledWith(userId);
});

test("only admins can update order status", async () => {
  const response = await runRoute("put", "/:id", ["READER"], {status: "completed"});

  expect(response.statusCode).toBe(403);
  expect(orderDAO.updateOrderById).not.toHaveBeenCalled();
});

test("admin status updates validate the status and only write the status field", async () => {
  const invalid = await runRoute("put", "/:id", ["ADMIN"], {status: "unknown"});
  expect(invalid.statusCode).toBe(400);
  expect(orderDAO.updateOrderById).not.toHaveBeenCalled();

  orderDAO.updateOrderById.mockResolvedValue({...order, status: "completed"});
  const updated = await runRoute("put", "/:id", ["ADMIN"], {status: "completed", totalCost: 10});
  expect(updated.statusCode).toBe(200);
  expect(orderDAO.updateOrderById).toHaveBeenCalledWith(orderId, {status: "completed"});
});

test("new orders use the authenticated customer and begin as pending", async () => {
  orderDAO.createOrder.mockResolvedValue(order);
  productDAO.getActiveProductsByIds.mockResolvedValue([{_id: orderId}]);

  const response = await runRoute("post", "/", ["READER"], {
    username: "other-customer", status: "completed", items: [{productId: orderId}],
  });

  expect(response.statusCode).toBe(201);
  expect(orderDAO.createOrder).toHaveBeenCalledWith(expect.objectContaining({
    userId,
    username: "customer",
    status: "pending",
  }));
});

test("checkout rejects products that are no longer in the active catalog", async () => {
  productDAO.getActiveProductsByIds.mockResolvedValue([]);

  const response = await runRoute("post", "/", ["READER"], {items: [{productId: orderId}]});

  expect(response.statusCode).toBe(400);
  expect(orderDAO.createOrder).not.toHaveBeenCalled();
});
