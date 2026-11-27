const orderDAO = require("../dao/order.dao");
const productDAO = require("../dao/product.dao");
const orderDTO = require("../dto/order.dto");

exports.getAllOrders = async () => {
  const orders = await orderDAO.findAllOrders();
  return orderDTO.toOrderListDTO(orders);
};

exports.getOrdersByUserId = async (userId) => {
  const orders = await orderDAO.findOrdersByUserId(userId);
  return orderDTO.toOrderListDTO(orders);
};

exports.getOrderById = async (id) => {
  const order = await orderDAO.findOrderById(id);
  return order ? orderDTO.toOrderDTO(order) : null;
};

exports.createOrder = async (data) => {
  if (!Array.isArray(data.items) || data.items.length === 0) return null;
  const productIds = [...new Set(data.items.map(item => String(item?.productId || "")))];
  if (productIds.some(id => !/^[a-f0-9]{24}$/i.test(id))) return null;
  const availableProducts = await productDAO.getActiveProductsByIds(productIds);
  const availableIds = new Set(availableProducts.map(product => String(product._id).toLowerCase()));
  if (productIds.some(id => !availableIds.has(id.toLowerCase()))) return null;

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
