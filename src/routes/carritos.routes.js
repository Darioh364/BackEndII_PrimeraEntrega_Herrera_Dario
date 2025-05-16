import { Router } from "express";
import { getCart, insertProductCart, updateQuantityProductCart, deleteCart, deleteProductCart, purchaseCart} from "../controllers/carts.controllers.js";
import { authorizationMiddleware } from '../middleware/authorizationMiddleware.js';

const cartRouter = Router()
// Ruta protegidaS para el usuario
cartRouter.post('/:cid/products/:pid', authorizationMiddleware('user'), insertProductCart); // Solo usuarios pueden agregar productos al carrito
cartRouter.delete('/:cid', authorizationMiddleware('user'), deleteCart);  //Elimino el carrito
cartRouter.delete('/:cid/products/:pid', deleteProductCart); //Elimino producto del carrito
cartRouter.put('/:cid/products/:pid', authorizationMiddleware('user'), updateQuantityProductCart);  //Actualizo cantidad de productos
cartRouter.post('/:cid/purchase', authorizationMiddleware('user'), purchaseCart);


cartRouter.get('/:cid', authorizationMiddleware('user'), getCart); //Consultar los productos guardados en un carrito





export default cartRouter