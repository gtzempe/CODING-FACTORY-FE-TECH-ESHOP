const logger = require("../utils/logger");
const productService = require("../services/product.service");

exports.getAllProducts = async (req, res) => {
  logger.info("GET /api/products - Fetching all products");

  try {
    const products = await productService.getAllProducts();
    logger.info("GET /api/products - Products fetched successfully");
    res.status(200).json({ status: true, data: products });
  } catch (err) {
    logger.error(`GET /api/products - Failed: ${err.message}`);
    res.status(500).json({ status: false, data: err.message });
  }
};

exports.getProductById = async (req, res) => {
  const productId = req.params.id;
  logger.info(`GET /api/products/${productId} - Fetching product`);

  try {
    const product = await productService.getProductById(productId);

    if (!product) {
      logger.warn(`GET /api/products/${productId} - Product not found`);
      return res.status(404).json({ status: false, data: "Product not found" });
    }

    logger.info(
      `GET /api/products/${productId} - Product fetched successfully`
    );
    res.status(200).json({ status: true, data: product });
  } catch (err) {
    logger.error(`GET /api/products/${productId} - Failed: ${err.message}`);
    res.status(500).json({ status: false, data: err.message });
  }
};

exports.createProduct = async (req, res) => {
  logger.info("POST /api/products - Creating product");

  try {
    const newProduct = await productService.createProduct(req.body);
    logger.info("POST /api/products - Product created successfully");
    res.status(201).json({ status: true, data: newProduct });
  } catch (err) {
    logger.error(`POST /api/products - Failed: ${err.message}`);
    res.status(400).json({ status: false, data: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  const productId = req.params.id;
  logger.info(`PUT /api/products/${productId} - Updating product`);

  try {
    const updatedProduct = await productService.updateProduct(
      productId,
      req.body
    );

    if (!updatedProduct) {
      logger.warn(`PUT /api/products/${productId} - Product not found`);
      return res.status(404).json({ status: false, data: "Product not found" });
    }

    logger.info(
      `PUT /api/products/${productId} - Product updated successfully`
    );
    res.status(200).json({ status: true, data: updatedProduct });
  } catch (err) {
    logger.error(`PUT /api/products/${productId} - Failed: ${err.message}`);
    res.status(400).json({ status: false, data: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const productId = req.params.id;
  logger.info(`DELETE /api/products/${productId} - Deleting product`);

  try {
    const deletedProduct = await productService.deleteProduct(productId);

    if (!deletedProduct) {
      logger.warn(`DELETE /api/products/${productId} - Product not found`);
      return res.status(404).json({ status: false, data: "Product not found" });
    }

    logger.info(
      `DELETE /api/products/${productId} - Product deleted successfully`
    );
    res.status(200).json({ status: true, data: deletedProduct });
  } catch (err) {
    logger.error(`DELETE /api/products/${productId} - Failed: ${err.message}`);
    res.status(500).json({ status: false, data: err.message });
  }
};
