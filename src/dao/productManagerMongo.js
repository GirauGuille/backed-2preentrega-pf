import { productsModel } from "../db/models/products.model.js";

export default class ProductManager {
  async getProducts() {
    try {
      const products = await productsModel.find().lean();
      return products;
    } catch (error) {
      console.log(`Error obteniendo todos los productos: ${error.message}`);
    }
  };

  async getAll() {
    try {
      const allProducts = await productsModel.find().lean();
      return allProducts;
    } catch (error) {
      console.log(`Error obteniendo todos los productos: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      const product = await productsModel.findOne({ _id: id });
      return product;
    } catch (error) {
      console.log(error);
    }
  };

  async addProducts(product) {
    try {
      const newProduct = await productsModel.create(product);
      return newProduct;
    } catch (error) {
      console.log(error);
    }
  };

  async updateProduct(id, obj) {
    try {
      const product = await productsModel.findOneAndUpdate({ _id: id }, obj);
      return product;
    } catch (error) {
      console.log(error);
    }
  };

  async deleteProducts() {
    try {
      await productsModel.deleteMany();
      return 'Products deleted';
    } catch (error) {
      console.log(error);
    }
  };

  async deleteProductsById() {
    try {
      await productsModel.deleteOne({ _id: id });
      return 'Product deleted';
    } catch (error) {
      console.log(error);
    }
  };
}