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
    res.status(201).json({ message: 'Carrito creado', cart: newCart });
  } catch (error) {
    console.log(error);
    res.status(500).json('El carrito no se encontro');
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    if (cart.length == 0) {
      res.json({ message: 'El carrito no existe' });
    } else {
      res.status(201).json(cart);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json('Error al buscar el carrito');
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const newCart = await cartManager.addProductsToCart(cid, pid);
    if (newCart === "Error: El carrito no existe") {
      res.status(404).json({ message: "El carrito no existe" });
    } else if (newCart === "Error: el producto no existe") {
      res.status(404).json({ message: "El producto no existe" });
    } else {
      res.status(201).json(newCart);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() || 'No fue posible encontrar el producto' });
  }
});

router.delete('/:cid/product/:pid', async (req, res) => {
  try {
      const { cid, pid } = req.params;
      const cart = await cartManager.deleteProductFromCart(cid, pid);
      if (cart) {
          res.status(200).send({ status: "success", payload: cart });
      } else {
          res.status(404).send({  error: 'Carrito o producto no encontrado' });
      }
  } catch (err) {
      console.error(err);
      res.status(500).send({ error: 'Error al eliminar el producto del carrito' });
  }
});

router.delete('/:cid', async (req, res) => {
  try {
      const { cid } = req.params;

      const cart = await cartManager.deleteAllProductsFromCart(cid);

      if (cart) {
          res.status(200).send({payload: cart });
      } else {
          res.status(404).send({ error: 'Carrito no encontrado' });
      }
  } catch (err) {
      console.error(err);
      res.status(500).send({ status: "error", error: 'Error al eliminar los productos del carrito' });
  }
});

router.put('/:cid', async (req, res) => {
  try {
      const { cid } = req.params;
      const { products } = req.body;
      const cart = await cartManager.updateAllProductsFromCart(cid, products);
      if (cart) {
          res.status(200).send({ payload: cart });
      } else {
          res.status(404).send({ error: 'Carrito o producto no encontrado' });
      }
  } catch (err) {
      console.error(err);
      res.status(500).send({ error: 'Error al actualizar los productos del carrito' });
  }
});

router.put('/:cid/product/:pid', async (req, res) => {
  try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      const cart = await cartManager.updateProductQuantityFromCart(cid, pid, quantity);
      if (cart) {
          res.status(200).send({ status: "success", payload: cart });
      } else {
          res.status(404).send({ error: 'Carrito o producto no encontrado' });
      }
  } catch (err) {
      console.error(err);
      res.status(500).send({ error: 'Error al actualizar la cantidad del producto en el carrito' });
  }
});

export default router;
