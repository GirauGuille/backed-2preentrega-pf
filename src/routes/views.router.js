import { Router } from 'express';
import ProductManager from '../Dao/ProductManagerMongo.js';
import { __dirname } from '../utils.js';

const path = __dirname + '/products.json';

const router = Router();

const productManager = new ProductManager(path);

/* home */
router.get("/", async (req, res) => {
  res.render("home", {
  });
});

/* realTimeProducts */
router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProductsViews();
  res.render("realTimeProducts", {
    products: products,
  });
});

/* chat */
router.get("/chat", async (req, res) => {
  const messages = await chatManager.getAllMessages();
  res.render("chat", {
    messages: messages,
  });
});

router.get("/products", async (req, res) => {
  const products = await productManager.getProductsViews();
  res.render("products", {
    products: products,});
});


export default router;
