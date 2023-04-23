import { Router } from "express";
import ProductManager from "../dao/productManagerMongo.js";

const router = Router();
const productManager = new ProductManager();
const notFound = { error: "Product not found" };

router.get("/", async (req, res) => {
  try{
    const { limit, page, sort, query } = req.query;

    const products = await productManager.getAll(limit, page, sort, query);

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

    res.status(200).send({ payload: products.docs, info });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Error al obtener los productos' });
  }
});

router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = await productManager.getById(pid);
  !product ? res.status(404).json(notFound) : res.status(200).json(product);
});

router.post("/", async (req, res) => {
  const product = req.body;
  const addedProduct = await productManager.addProduct(product);
  !addedProduct
    ? res.status(400).json({ error: "No se pudo agregar el producto" })
    : res.status(201).json(product);
});

router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const modification = req.body;
  const modifiedProduct = await productManager.updateProduct(pid, modification);
  !modifiedProduct
    ? res.status(400).json({ error: `No se pudo modificar el producto` })
    : res.status(200).json(modifiedProduct);
});

router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  const removedProduct = await productManager.deleteById(parseInt(pid));
  !removedProduct
    ? res.status(404).json(notFound)
    : res.status(200).json(removedProduct);
});

router.delete("/", async (req, res) => {
  const removedProducts = await productManager.deleteAll();
  !removedProducts
    ? res.status(404).json({ error: "No se pudo eliminar los productos" })
    : res.status(200).json(removedProducts);
});

export default router;
