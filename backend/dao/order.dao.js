const Order = require("../models/order.model");

exports.findAllOrders = async () => {
  return await Order.find();
};

exports.findOrdersByUserId = async (userId) => {
  return Order.find({ userId }).sort({ createdAt: -1 });
};

exports.findOrderById = async (orderId) => {
  return await Order.findById(orderId);
};
exports.createOrder = async (orderData) => {
  const newOrder = new Order(orderData);
  return await newOrder.save();
};

exports.updateOrderById = async (orderId, updateData) => {
  return await Order.findByIdAndUpdate(
    orderId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

exports.deleteOrderById = async (orderId) => {
  return await Order.findByIdAndDelete(orderId);
};
