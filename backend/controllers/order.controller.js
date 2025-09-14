const logger = require("../utils/logger");
const orderService = require("../services/order.service");

exports.getMyOrders = async (req, res) => {
  const username = req.user.username;
  logger.info(`GET /api/orders/me - Fetching orders for user: ${username}`);

  try {
    const orders = await orderService.getOrdersByUsername(username);
    logger.info(`GET /api/orders/me - Orders fetched for ${username}`);
    res.status(200).json({ status: true, data: orders });
  } catch (err) {
    logger.error(`GET /api/orders/me - Failed: ${err.message}`);
    res.status(500).json({ status: false, data: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  logger.info("GET /api/orders - Fetching all orders");

  try {
    const orders = await orderService.getAllOrders();
    logger.info("GET /api/orders - All orders fetched");
    res.status(200).json({ status: true, data: orders });
  } catch (err) {
    logger.error(`GET /api/orders - Failed: ${err.message}`);
    res.status(500).json({ status: false, data: err.message });
  }
};

exports.createOrder = async (req, res) => {
  const username = req.user.username;
  logger.info(`POST /api/orders - Creating order for user: ${username}`);

  try {
    const newOrder = await orderService.createOrder(req.body, username);

    if (!newOrder) {
      logger.warn(`POST /api/orders - Order creation failed`);
      return res
        .status(400)
        .json({ status: false, data: "Order creation failed" });
    }

    logger.info(`POST /api/orders - Order created for user: ${username}`);
    res.status(201).json({ status: true, data: newOrder });
  } catch (err) {
    logger.error(`POST /api/orders - Failed: ${err.message}`);
    res.status(500).json({ status: false, data: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  const orderId = req.params.id;
  logger.info(`DELETE /api/orders/${orderId} - Deleting order`);

  try {
    const deletedOrder = await orderService.deleteOrder(orderId);

    if (!deletedOrder) {
      logger.warn(`DELETE /api/orders/${orderId} - Order not found`);
      return res.status(404).json({ status: false, data: "Order not found" });
    }

    logger.info(`DELETE /api/orders/${orderId} - Order deleted`);
    res.status(200).json({ status: true, data: deletedOrder });
  } catch (err) {
    logger.error(`DELETE /api/orders/${orderId} - Failed: ${err.message}`);
    res.status(500).json({ status: false, data: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  const orderId = req.params.id;
  try {
    const order = await orderService.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ status: false, data: "Order not found" });
    }
    res.status(200).json({ status: true, data: order });
  } catch (err) {
    res.status(500).json({ status: false, data: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  const orderId = req.params.id;
  try {
    const updatedOrder = await orderService.updateOrder(orderId, req.body);
    if (!updatedOrder) {
      return res.status(404).json({ status: false, data: "Order not found" });
    }
    res.status(200).json({ status: true, data: updatedOrder });
  } catch (err) {
    res.status(500).json({ status: false, data: err.message });
  }
};
