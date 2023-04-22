import mongoose from 'mongoose';
import { cartModel } from "../db/models/carts.model.js";
import ProductManager from './productManagerMongo.js';

export default class CartManager {
  async addCarts() {
    try {
      const newCarts = await cartModel.create({ products: [] });
      return newCarts;
    } catch (error) {
      console.log(error);
    }
  };

  async deleteCarts(id) {
    try {
      const cart = await this.getById(id);
      if (!cart) {
        throw new Error(`No se encontro carrito con el id solicitado.`);
      } else {
        await cartModel.findOneAndDelete({ _id: id });
        return "Carrito eliminado correctamente";
      }
    } catch (error) {
      console.log(`Error eliminando el carrito`);
    }
  }

  async getCartById(id) {
    try {
      const cart = await cartModel.findOne({ _id: id });
      return cart;
    } catch (error) {
      console.log(error);
    }
  };

  async addProductsToCart(cid, pid) {
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

  async deleteProduct(cartId, productId) {
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
      console.log(`No se pudo eliminar el producto ${error.message}`);
  }
}

  async deleteAllProducts(cartId) {
    try {
      const cart = await cartModel.findById(cartId);
            if (!cart) {
                return null;
            }
            cart.products = [];
            await cart.updateOne({ products: cart.products });
            return cart;
        } catch (error) {
            console.log(`Error eliminando todos los productos del carrito: ${error.message}`);}
  }

  async updateAllProductsFromCart(cartId, products) {
    try {
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            return null;
        }
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
        console.log(`Error al actualizar todos los productos del carrito: ${error.message}`);
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
        console.log(`Error al actualizar la cantidad del producto en el carrito: ${error.message}`);
    }
}
}
