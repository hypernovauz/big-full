const Product = require("../models/Product");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.json(
      products.map((product) => ({
        _id: product._id,
        name: product.name,
        category: product.category,
        price: product.price,
        qalinligi: product.qalinligi,
      }))
    );
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json({
      _id: product._id,
      name: product.name,
      category: product.category,
      price: product.price,
      qalinligi: product.qalinligi,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const newProduct = new Product({
      name: req.body.name,
      category: req.body.category,
      qalinligi: req.body.qalinligi,
      price: req.body.price,
    });
    const savedProduct = await newProduct.save();
    return res.json(savedProduct);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        category: req.body.category,
        qalinligi: req.body.qalinligi,
        price: req.body.price,
      },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json({
      _id: updatedProduct._id,
      name: updatedProduct.name,
      category: updatedProduct.category,
      price: updatedProduct.price,
      qalinligi: updatedProduct.qalinligi,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
