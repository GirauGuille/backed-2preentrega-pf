import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import { __dirname } from './utils.js';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';
import './db/dbConfig.js';
import ProductManager from '../src/Dao/ProductManagerMongo.js';
//import chatManager from '../src/Dao/ChatManagerMongo.js';

const path = __dirname + '/products.json';


const app = express();
const PORT = 8080;
const productManager = new ProductManager(path);
//const chatManager = new ChatManager();

/* middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

/* handlebars */
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

/* routers */
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);


/* server */
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${httpServer.address().port}`);
  console.log(`http://localhost:${PORT}`);
});
httpServer.on("error", error =>
  console.log(`Error en servidor: ${error.message}`)
);


/* webSocket */
const socketServer = new Server(httpServer);
socketServer.on("connection", async socket => {
  const products = await productManager.getAll();
  const messages = await chatManager.getAllMessages();

  socket.emit("products", products);

  socket.on("newProduct", async data => {
    await productManager.addProduct(data);
    const products = await productManager.getAll();
    socket.emit("products", products);
  });

  socket.on("deleteProduct", async id => {
    await productManager.deleteById(id);
    const products = await productManager.getAll();
    socket.emit("products", products);
  });

  socket.emit("messages", messages);

  socket.on("newMessage", async data => {
    await chatManager.addMessage(data);
    socket.emit("messages", messages);
  });
});