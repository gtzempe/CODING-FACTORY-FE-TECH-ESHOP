const Product = require("../models/product.model");

const publicCatalog = {
  $or: [{ status: "active" }, { status: { $exists: false } }],
};

exports.getAllProducts = async () => Product.find(publicCatalog);

exports.getAdminProducts = async () => Product.find().sort({ product: 1 });

exports.getProductById = async (id) => Product.findOne({ _id: id, ...publicCatalog });

exports.getActiveProductsByIds = async (ids) => Product.find({
  _id: { $in: ids },
  ...publicCatalog,
}).select("_id");

exports.createProduct = async (productData) => {
  const product = new Product(productData);
  return await product.save();
};

exports.updateProduct = async (id, updateData) => {
  return await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

exports.deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};
