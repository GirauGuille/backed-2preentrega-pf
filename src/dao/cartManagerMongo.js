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
  
  async deleteProductFromCart(cartId, productId) {
    try {
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            return null;
        }
        const product = cart.products.find((product) => product.pid.toString() === productId);
        if (!product) {
            return null;
        }
        if (product.quantity > 1) {
            product.quantity--;
            await cart.updateOne({ products: cart.products });
        } else {
            cart.products = cart.products.filter((product) => product.pid.toString() !== productId);
            await cart.updateOne({ products: cart.products });
        }
        return cart;
    } catch (error) {
        console.log(error);
    }
}

async deleteAllProductsFromCart(cartId) {
    try {
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            return null;
        }
        cart.products = [];
        await cart.updateOne({ products: cart.products });
        return cart;
    } catch (error) {
        console.log(error);
    }
}

async updateAllProductsFromCart(cartId, products) {
    try {
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            return null;
        }
        // verificar que los productos existan
        for (const product of products) {
            const pro = await productsModel.findById(product.pid);
            if (!pro) {
                return null;
            }
        }
        cart.products = products;
        await cart.updateOne({ products: cart.products });
        return cart;
    } catch (error) {
        console.log(error);
    }
}

async updateProductQuantityFromCart(cartId, productId, quantity) {
    try {
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            return null;
        }
        const product = cart.products.find((product) => product.pid.toString() === productId);
        if (!product) {
            return null;
        }
        product.quantity = quantity;
        await cart.updateOne({ products: cart.products });
        return cart;
    } catch (error) {
        console.log(error);
    }
}
}

export default CartManager;
