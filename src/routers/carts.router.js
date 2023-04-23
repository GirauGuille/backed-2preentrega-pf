import { Router } from "express";
import CartManager from "../dao/cartManagerMongo.js";

const router = Router();
const cartManager = new CartManager();
const notFound = { error: "Cart not found" };

router.post("/", async (req, res) => {
  const cart = await cartManager.createCart();
  res.status(201).json(cart);
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartManager.getById(cid);
  !cart ? res.status(404).json(notFound) : res.status(200).json(cart);
});

router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;
  const cart = await cartManager.updateAllProductsFromCart(cid, products);
  !cart ? res.status(404).json(notFound) : res.status(200).json(cart);
});

router.put('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  const cart = await cartManager.updateProductQuantityFromCart(cid, pid, quantity);
  !cart ? res.status(404).json(notFound) : res.status(200).json(cart);
});

router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = cartManager.deleteAllProducts(cid);
  const updatedCart = await cartManager.getById(cid);
  !cart ? res.status(404).json(notFound) : res.status(200).json(updatedCart);
});

router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await cartManager.addToCart(cid, pid);
  !cart ? res.status(404).json(notFound) : res.status(200).json(cart);
});

router.delete("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await cartManager.deleteProduct(cid, pid);
  !cart ? res.status(404).json(notFound) : res.status(200).json(cart);
});

export default router;
