const productDAO = require("../dao/product.dao");
const productDTO = require("../dto/product.dto");

const productFields = ["product", "description", "category", "image", "price", "stock", "status"];

function catalogFields(data) {
  return Object.fromEntries(productFields.filter(field => Object.hasOwn(data || {}, field))
    .map(field => [field, data[field]]));
}

exports.getAllProducts = async () => {
  const products = await productDAO.getAllProducts();
  return productDTO.toProductListDTO(products);
};

exports.getAdminProducts = async () => {
  const products = await productDAO.getAdminProducts();
  return productDTO.toProductListDTO(products);
};

exports.getProductById = async (id) => {
  const product = await productDAO.getProductById(id);
  return product ? productDTO.toProductDTO(product) : null;
};

exports.createProduct = async (data) => {
  const newProduct = await productDAO.createProduct(catalogFields(data));
  return productDTO.toProductDTO(newProduct);
};

exports.updateProduct = async (id, data) => {
  const updatedProduct = await productDAO.updateProduct(id, catalogFields(data));
  return updatedProduct ? productDTO.toProductDTO(updatedProduct) : null;
};

exports.deleteProduct = async (id) => {
  return await productDAO.deleteProduct(id);
};
