import { Router } from 'express';
import CartManager from '../Dao/CartManagerMongo.js';
import { __dirname } from '../utils.js';

const path = __dirname + '/carts.json';

const router = Router();

const cartManager = new CartManager(path);

const products = [1, 2, 3];

router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.addCarts();
    res.status(201).json({ message: 'Cart created', cart: newCart });
  } catch (error) {
    console.log(error);
    res.status(500).json('cart search error');
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    if (cart.length == 0) {
      res.json({ message: 'Cart does not exist' });
    } else {
      res.status(201).json(cart);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json('cart search error');
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const newCart = await cartManager.addProductsToCart(cid, pid);
    if (newCart === "Error: Cart doesn't exist") {
      res.status(404).json({ message: "Cart doesn't exist" });
    } else if (newCart === "Error: Product doesn't exist") {
      res.status(404).json({ message: "Product doesn't exist" });
    } else {
      res.status(201).json(newCart);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() || 'It was not possible to add the product' });
  }
});

export default router;
