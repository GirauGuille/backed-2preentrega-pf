import { cartsModel } from "../db/models/carts.model.js";
import { productsModel } from "../db/models/products.model.js";

export default class CartManager {
  async createCart() {
    try {
      const cart = await cartsModel.create({});
      return cart;
    } catch (error) {
      console.log(`Error creando carrito: ${error.message}`);
    }
  }

  async deleteCart(id) {
    try {
      const cart = await this.getById(id);
      if (!cart) {
        throw new Error(`No se encontro carrito con el id solicitado.`);
      } else {
        await cartsModel.findOneAndDelete({ _id: id });
        return "Carrito eliminado correctamente";
      }
    } catch (error) {
      console.log(`Error eliminando el carrito`);
    }
  }

  async getById(id) {
    try {
      const cart = await cartsModel
        .findOne({ _id: id })
        .populate("products.product")
        .lean();
      return cart;
    } catch (error) {
      console.log(
        `Error buscando el carrito con el id ${id}: ${error.message}`
      );
    }
  }

  async addToCart(cid, pid) {
    try {
      const cart = await cartsModel.findOneAndUpdate(
        { _id: cid, "products.product": pid },
        { $inc: { "products.$.quantity": 1 } },
        { new: true }
      );
      if (!cart) {
        const cart = await cartsModel.findOneAndUpdate(
          { _id: cid },
          { $addToSet: { products: { product: pid, quantity: 1 } } },
          { new: true }
        );
        return cart;
      }
      return cart;
    } catch (error) {
      console.log(`Error agregando producto al carrito: ${error.message}`);
    }
  }

  async deleteProduct(cid, pid) {
    try {
      const cart = await cartsModel.findById(cid); //this.getById(cid);
      if (!cart) {
        throw new Error(`No se encontro un carrito con el id solicitado.`);
      } else {
        const product = await productsModel.findById(pid);
        if (!product) {
          throw new Error(`No se encontro el product con el id solicitado.`);
        } else {
          const cartProduct = cart.products.find(
            product => product.product.toString() === pid
          );
          if (!cartProduct) {
            throw new Error(`Producto no se encuentra en el carrito.`);
          } else {
            const quantity = cartProduct.quantity;
            if (quantity > 1) {
              cartProduct.quantity--;
            } else {
              //falta eliminar el producto cuando el quantity es 1
            }
          }
          cart.save();
          return cart;
        }
      }
    } catch (error) {
      console.log(`Error eliminando producto del carrito: ${error.message}`);
    }
  }

  async deleteAllProducts(id) {
    try {
      const cart = await cartsModel.findOneAndUpdate(
        { _id: id },
        { products: [] }
      );
      return cart;
    } catch (error) {
      console.log(
        `Error eliminando todos los productos del carrito: ${error.message}`
      );
    }
  }
}
