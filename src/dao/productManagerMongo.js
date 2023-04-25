import { productModel } from '../db/models/products.model.js';

class ProductManager {
  getProducts = async () => {
    try {
      const products = await productModel.find().lean();
/*       const options = {
        page: page || 1,
        limit: limit || 10,
        sort: sort,
        lean: true,
    }
    const products = await productModel.paginate(options) */
      return products;
    } catch (error) {
      console.log(error);
    }
  };

  getProductById = async (id) => {
    try {
      const product = await productModel.findOne({ _id: id });
      return product;
    } catch (error) {
      console.log(error);
    }
  };

  addProducts = async (product) => {
    try {
      const newProduct = await productModel.create(product);
      return newProduct;
    } catch (error) {
      console.log(error);
    }
  };

  updateProduct = async (id, obj) => {
    try {
      const product = await productModel.findOneAndUpdate({ _id: id }, obj);
      return product;
    } catch (error) {
      console.log(error);
    }
  };

  deleteProducts = async () => {
    try {
      await productModel.deleteMany();
      return 'Products deleted';
    } catch (error) {
      console.log(error);
    }
  };

  deleteProductsById = async (id) => {
    try {
      await productModel.deleteOne({ _id: id });
      return 'Product deleted';
    } catch (error) {
      console.log(error);
    }
  };
}

export default ProductManager;
