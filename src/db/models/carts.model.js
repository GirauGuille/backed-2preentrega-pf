import mongoose from 'mongoose';

const cartsSchema = new mongoose.Schema({
  products: [{ product: mongoose.SchemaTypes.ObjectId, quantity: Number }],
});

export const cartModel = mongoose.model('Carts', cartsSchema);
