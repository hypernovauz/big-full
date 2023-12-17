const Product = require("../models/Product");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.json(
      products.map((product) => ({
        _id: product._id,
        category: product.category,
        selectCategory: product.selectCategory,
        name: product.name,
        model: product.model,
        price: product.price,
        length: product.length,
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
      category: product.category,
      selectCategory: product.selectCategory,
      name: product.name,
      model: product.model,
      price: product.price,
      length: product.length,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const newProduct = new Product({
      selectCategory: req.body.selectCategory,
      category: req.body.category,
      name: req.body.name,
      model: req.body.model,
      length: req.body.length,
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
        selectCategory: req.body.selectCategory,
        category: req.body.category,
        name: req.body.name,
        model: req.body.model,
        length: req.body.length,
        price: req.body.price,
      },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json({
      _id: updatedProduct._id,
      selectCategory: updatedProduct.selectCategory,
      name: updatedProduct.name,
      category: updatedProduct.category,
      price: updatedProduct.price,
      model: updatedProduct.model,
      length: updatedProduct.length,
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
