import {Router} from 'express'
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct} from '../controllers/products.controllers.js';
import { authorizationMiddleware } from '../middleware/authorizationMiddleware.js';

const productRouter = Router()

productRouter.get('/', getProducts) // Consultar productos
productRouter.get('/:pid', getProduct) // Consultar producto via ID

// Rutas protegidas para administrar productos
productRouter.post('/create', authorizationMiddleware('admin'), createProduct); // Solo admin puede crear productos
productRouter.put('/update/:pid', authorizationMiddleware('admin'), updateProduct); // Solo admin puede actualizar productos
productRouter.delete('/delete/:pid', authorizationMiddleware('admin'), deleteProduct); // Solo admin puede eliminar productos

export default productRouter

