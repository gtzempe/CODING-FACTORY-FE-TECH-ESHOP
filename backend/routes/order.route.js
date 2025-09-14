const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");
const verifyToken = require("../middlewares/auth.middleware").verifyToken;
const verifyRoles = require("../middlewares/auth.middleware").verifyRoles;

router.get("/me", verifyToken, orderController.getMyOrders);

router.get(
  "/",
  verifyToken,
  verifyRoles("ADMIN"),
  orderController.getAllOrders
);
router.post("/", verifyToken, orderController.createOrder);
router.delete(
  "/:id",
  verifyToken,
  verifyRoles("ADMIN"),
  orderController.deleteOrder
);

module.exports = router;
