const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  writeCategory: {
    type: String,
  },
  category: {
    type: String,
  },
  name: {
    type: String,
  },
  model: {
    type: String,
  },
  length: {
    type: Number,
  },
  price: {
    type: Number,
  },
});
const Product = mongoose.model("product", productSchema);
module.exports = Product;
