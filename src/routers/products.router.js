import { Router } from "express";
import ProductManager from "../dao/productManagerMongo.js";
import { __dirname } from '../utils.js';

const path = __dirname + '../data/products.json';

const router = Router();

const productManager = new ProductManager(path);

router.get('/', async (req, res) => {
  try {
    const { limit, page, sort, query  } = req.query;
    const products = await productManager.getProducts(limit, page, sort, query);
    products.docs = products.docs.map(product => {
      const { _id, title, description, price, code, stock, category, thumbnail } = product;
      return { id: _id, title, description, price, code, stock, category, thumbnail };
  });
    const info = {
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage ? `http://localhost:8080/api/products?page=${products.prevPage}` : null,
      nextLink: products.hasNextPage ? `http://localhost:8080/api/products?page=${products.nextPage}` : null,
    }

    if (!limit) {
      res.status(201).json({  payload: products.docs, info });
    } else {
      let newLimit = parseInt(req.query.limit);
      const filterProducts = products.filter((p) => p.id <= newLimit);
      res.json({ filterProducts });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    if (!product) {
      res.json({ error: 'Producto no encontrado' });
    } else {
      res.json(product);
    }
  } catch (error) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

router.post('/', async (req, res) => {
  try {
    const obj = req.body;
    const newProduct = await productManager.addProducts(obj);
    res.status(201).json({ message: 'Product created', product: newProduct });
  } catch (error) {
    console.error(err);
    res.status(400).json({ error: 'no se pudo agregar el producto' });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const obj = req.body;
    const product = await productManager.updateProduct(pid, obj);
    res.status(201).json({ product });
  } catch (error) {
    console.error(err);
    res.status(500).json({ error: 'no se pudo actualizar el producto' });
  }
});

router.delete('/', async (req, res) => {
  try {
    const response = await productManager.deleteProducts();
    res.status(201).json({ response });
  } catch (error) {
    console.error(err);
    res.status(500).json({ error: 'no se pudo borrar el producto' });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const products = await productManager.deleteProductsById(pid);
    res.status(201).json({ products });
  } catch (error) {
    console.error(err);
    res.status(500).json({ error: 'no se pudo borrar el producto' });
  }
});

export default router;
