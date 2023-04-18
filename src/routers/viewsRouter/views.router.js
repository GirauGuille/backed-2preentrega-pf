import { Router, json } from "express";
import ProductManager from "../../dao/productManagerMongo.js";
import ChatManager from "../../dao/chatManagerMongo.js";
import { cartsModel } from "../../db/models/carts.model.js";
import CartManager from "../../dao/cartManagerMongo.js";

const router = Router();
const productManager = new ProductManager();
const chatManager = new ChatManager();
const cartManager = new CartManager();

/* home */
router.get("/", async (req, res) => {
  const products = await productManager.getAll();
  res.render("home", {
    products: products,
  });
});

/* realTimeProducts */
router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getAll();
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
  res.render("products", {
    
  });
});

router.get("/carts", async (req, res) => {
  res.render("carts", {
    });
});

router.get("/carts/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartManager.getById(cid);
  const cartsProducts = cart.products;
  res.render("cartsId", {
    cartsProducts: cartsProducts,
  });
});

export default router;
