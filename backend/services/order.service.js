const orderDAO = require("../dao/order.dao");
const orderDTO = require("../dto/order.dto");

exports.getAllOrders = async () => {
  const orders = await orderDAO.findAllOrders();
  return orderDTO.toOrderListDTO(orders);
};

exports.getOrderById = async (id) => {
  const order = await orderDAO.findOrderById(id);
  return order ? orderDTO.toOrderDTO(order) : null;
};

exports.createOrder = async (data) => {
  const orderData = orderDTO.toOrderCreateDTO(data);
  const createdOrder = await orderDAO.createOrder(orderData);
  return orderDTO.toOrderDTO(createdOrder);
};

exports.updateOrder = async (id, data) => {
  const updated = await orderDAO.updateOrderById(id, data);
  return updated ? orderDTO.toOrderDTO(updated) : null;
};

exports.deleteOrder = async (id) => {
  const deleted = await orderDAO.deleteOrderById(id);
  return deleted ? orderDTO.toOrderDTO(deleted) : null;
};
