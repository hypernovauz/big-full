const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  writeCategory: {
    type: String,
  },
  category: {
    type: String,
  },
  length: {
    type: String,
  },
  price: {
    type: Number,
  },
});
const Product = mongoose.model("product", productSchema);
module.exports = Product;
