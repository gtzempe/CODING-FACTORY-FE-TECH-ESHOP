const express = require("express");
const router = express.Router();

const productController = require("../controllers/product.controller");
const verifyToken = require("../middlewares/auth.middleware").verifyToken;
const verifyRoles = require("../middlewares/auth.middleware").verifyRoles;

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post(
  "/",
  verifyToken,
  verifyRoles("ADMIN"),
  productController.createProduct
);
router.put(
  "/:id",
  verifyToken,
  verifyRoles("ADMIN"),
  productController.updateProduct
);
router.delete(
  "/:id",
  verifyToken,
  verifyRoles("ADMIN"),
  productController.deleteProduct
);

module.exports = router;
