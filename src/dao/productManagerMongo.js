import { productModel } from '../db/models/products.model.js';

class ProductManager {
  getProducts = async (limit, page, sort, query) => {
    try {
      const search = query ? {
          stock: { $gt: 0 },
          $or: [
              { category: { $regex: query, $options: 'i' } },
              { title: { $regex: query, $options: 'i' } },
          ]
      } : {
          stock: { $gt: 0 }
      }
      if (sort === 'asc') {
          sort = { price: 1 };
      } else if (sort === 'desc') {
          sort = { price: -1 };
      }

      const options = {
          page: page || 1,
          limit: limit || 10,
          sort: sort,
          lean: true,
      }

      const allProducts = await productModel.paginate(search, options)
      return allProducts;
  } catch (error) {
      console.log(error);
  }
}

async getProductsViews() {
  try {
    const products = await productModel.find().lean();
    return products;
  } catch (error) {
    console.log(`Error obteniendo todos los productos: ${error.message}`);
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
