const Product = require("../models/product.model");
const productDAO = require("../dao/product.dao");
const productDTO = require("../dto/product.dto");
const router = require("../routes/product.route");
const auth = require("../services/auth.service");

afterEach(() => jest.restoreAllMocks());

test("public catalog and product details allow active and legacy products only", async () => {
  const find = jest.spyOn(Product, "find").mockResolvedValue([]);
  const findOne = jest.spyOn(Product, "findOne").mockResolvedValue(null);
  const visibility = {
    $or: [{status: "active"}, {status: {$exists: false}}],
  };

  await productDAO.getAllProducts();
  await productDAO.getProductById("0123456789abcdef01234567");

  expect(find).toHaveBeenCalledWith(visibility);
  expect(findOne).toHaveBeenCalledWith({_id: "0123456789abcdef01234567", ...visibility});
  expect(productDTO.toProductDTO({}).status).toBe("active");
});

test("the admin catalog includes all statuses and its route requires the admin role", async () => {
  const sort = jest.fn().mockResolvedValue([{status: "archived"}]);
  const find = jest.spyOn(Product, "find").mockReturnValue({sort});
  const visibility = await productDAO.getAdminProducts();
  expect(visibility).toEqual([{status: "archived"}]);
  expect(find).toHaveBeenCalledWith();

  const getPaths = router.stack.filter(layer => layer.route?.methods.get);
  expect(getPaths.map(layer => layer.route.path)).toEqual(["/", "/admin", "/:id"]);

  jest.spyOn(auth, "verifyAccessToken").mockReturnValue({success: true, data: {roles: ["READER"]}});
  const [verifyToken, verifyRole] = getPaths[1].route.stack.map(layer => layer.handle);
  const req = {headers: {authorization: "Bearer customer-token"}};
  const res = {status: jest.fn().mockReturnThis(), json: jest.fn()};
  const next = jest.fn();
  verifyToken(req, res, () => verifyRole(req, res, next));

  expect(res.status).toHaveBeenCalledWith(403);
  expect(next).not.toHaveBeenCalled();
});