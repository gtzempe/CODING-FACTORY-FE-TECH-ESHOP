exports.toOrderDTO = (order) => ({
  id: order._id,
  userId: order.userId,
  username: order.username,
  items: order.items,
  shippingAddress: order.shippingAddress,
  status: order.status,
  totalCost: order.totalCost,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
});

exports.toOrderListDTO = (orders) => {
  return orders.map((order) => exports.toOrderDTO(order));
};

exports.toOrderCreateDTO = (data) => ({
  userId: data.userId,
  username: data.username,
  items: data.items.map((item) => ({
    productId: item.productId,
    product: item.product,
    quantity: item.quantity,
    price: item.price,
    image: item.image,
  })),
  shippingAddress: data.shippingAddress,
  status: data.status || "pending",
  totalCost: data.totalCost,
});
