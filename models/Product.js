const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  category: {
    type: String,
  },
  name: {
    type: String,
  },
  qalinligi: {
    type: String,
  },
  price: {
    type: Number,
  },
});
const Product = mongoose.model("product", productSchema);
module.exports = Product;
