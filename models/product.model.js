const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: String,
  price: { type: Number, default: 0 },
  description: String
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;