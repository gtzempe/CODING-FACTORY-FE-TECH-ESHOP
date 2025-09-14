const productDAO = require("../dao/product.dao");
const productDTO = require("../dto/product.dto");

exports.getAllProducts = async () => {
  const products = await productDAO.getAllProducts();
  return productDTO.toProductListDTO(products);
};

exports.getProductById = async (id) => {
  const product = await productDAO.getProductById(id);
  return product ? productDTO.toProductDTO(product) : null;
};

exports.createProduct = async (data) => {
  const newProduct = await productDAO.createProduct(data);
  return productDTO.toProductDTO(newProduct);
};

exports.updateProduct = async (id, data) => {
  const updatedProduct = await productDAO.updateProduct(id, data);
  return updatedProduct ? productDTO.toProductDTO(updatedProduct) : null;
};

exports.deleteProduct = async (id) => {
  return await productDAO.deleteProduct(id);
};
