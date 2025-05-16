import cartModel from "../models/cart.model.js";
import mongoose from 'mongoose';


export default class CartDao {
    // Crear un carrito
    async createCart() {
        try {
            const cart = new cartModel();
            console.log(cart)
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al crear carrito: ", error);
            throw error;
        }
    }

    // Obtener un carrito por ID
    async getCartById(id) {
    try {
        const cart = await cartModel.findById(id).populate('products.id_prod').exec();
        console.log("Cart encontrado:", cart);  // Verifica que cart es un documento Mongoose
        return cart;
    } catch (error) {
        console.error("Error al obtener carrito: ", error);
        throw error;
    }
}

    // Añadir un producto al carrito
    async addProductToCart(cartId, productId, quantity) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) throw new Error('Carrito no encontrado');

            const productIndex = cart.products.findIndex(p => p.id_prod.toString() === productId);
            if (productIndex > -1) {
                cart.products[productIndex].quantity += quantity; // Si el producto ya está, solo sumamos la cantidad
            } else {
                cart.products.push({ id_prod: productId, quantity });
            }

            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al agregar producto al carrito: ", error);
            throw error;
        }
    }

    // Actualizar la cantidad de un producto en el carrito
    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) throw new Error('Carrito no encontrado');

            const productIndex = cart.products.findIndex(p => p.id_prod._id.toString() === productId);  // Usamos _id para comparar
            if (productIndex === -1) throw new Error('Producto no encontrado');

            // Actualizamos la cantidad
            cart.products[productIndex].quantity = quantity;

            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al actualizar producto en el carrito: ", error);
            throw error;
        }
    }



    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) throw new Error('Carrito no encontrado');

            cart.products.forEach((p, i) => {
                console.log(`Producto ${i + 1}:`, {
                    id_prod: p.id_prod,
                    id_prod_str: p.id_prod.toString(),
                    quantity: p.quantity
                });
            });

            // Validar que el productId es un ObjectId
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                throw new Error("El productId no es válido");
            }

            cart.products = cart.products.filter(p => p.id_prod._id.toString() !== productId);


            // Guardar el carrito
            const savedCart = await cart.save();

            return savedCart;
        } catch (error) {
            throw error;
        }
    }

    // Eliminar un carrito
    async deleteById(id) {
        return await cartModel.findByIdAndDelete(id);

    }

}
