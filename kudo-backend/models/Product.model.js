// models/product.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  productName: {
    type: String,
  },
  baseCpm: {
    type: String,
  },
  budget: {
    type: String,
  },
  override: String,
  impressions: String,
  clientCpm: String,
  zenonCommission: String,
  user: String,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
