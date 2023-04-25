import mongoose from 'mongoose';
import { cartModel } from '../db/models/carts.model.js';
import ProductManager from './ProductManagerMongo.js';

class CartManager {
  getCartById = async (id) => {
    try {
      const cart = await cartModel.findOne({ _id: id });
      return cart;
    } catch (error) {
      console.log(error);
    }
  };

  addCarts = async () => {
    try {
      const newCarts = await cartModel.create({ products: [] });
      return newCarts;
    } catch (error) {
      console.log(error);
    }
  };

  addProductsToCart = async (cid, pid) => {
    const cart = await this.getCartById(cid);
    if (!cart) {
      return "Error: Cart doesn't exist";
    } else {
      const productManager = new ProductManager();
      const prod = await productManager.getProductById(pid);
      if (!prod) {
        return "Error: Product doesn't exist";
      }

      const productItem = cart.products.find((p) => p.product.equals(pid));
      if (!productItem) {
        cart.products.push({ product: new mongoose.Types.ObjectId(pid), quantity: 1 });
      } else {
        productItem.quantity++;
      }
      await cartModel.findOneAndUpdate({ _id: cid }, cart);
      return cart;
    }
  };
}

export default CartManager;
