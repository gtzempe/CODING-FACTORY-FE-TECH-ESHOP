exports.toProductDTO = (product) => ({
  id: product._id,
  product: product.product,
  description: product.description,
  category: product.category,
  image: product.image,
  price: product.price,
  stock: product.stock,
});

exports.toProductListDTO = (products) => {
  return products.map((product) => exports.toProductDTO(product));
};
