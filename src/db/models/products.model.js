import mongoose from 'mongoose';

const productsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    index: true,
  },
  price: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: Array,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  stock: {
    type: String,
    required: true,
    default: 0,
  },
  status: {
    type: Boolean,
    required: true,
  },
});

export const productModel = mongoose.model('Products', productsSchema);
