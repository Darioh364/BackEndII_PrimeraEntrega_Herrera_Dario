import CartDao from "../dao/CartDao.js";

class CartRepository {
    constructor() {
        this.cartDao = new CartDao();
    }

    // Crear un carrito
    async createCart() {
        try {
            return await this.cartDao.createCart();
        } catch (error) {
            console.error("Error en repository al crear carrito: ", error);
            throw error;
        }
    }

    // Obtener un carrito por ID con populate para los productos
    async getCartById(id) {
    try {
        const cart = await this.cartDao.getCartById(id);
        console.log("Cart desde CartDao:", cart);  // Verifica el tipo de objeto que recibes
        return cart;
    } catch (error) {
        console.error("Error en repository al obtener carrito:", error);
        throw error;
    }
}


    // Añadir un producto al carrito
    async addProductToCart(cartId, productId, quantity) {
        try {
            return await this.cartDao.addProductToCart(cartId, productId, quantity);
        } catch (error) {
            console.error("Error en repository al agregar producto al carrito: ", error);
            throw error;
        }
    }

    // Actualizar la cantidad de un producto en el carrito
    async updateProductQuantity(cartId, productId, quantity) {
        try {
            return await this.cartDao.updateProductQuantity(cartId, productId, quantity);
        } catch (error) {
            console.error("Error en repository al actualizar producto en carrito: ", error);
            throw error;
        }
    }

    // Eliminar un carrito
    async deleteCart(cartId) {
        try {
            const result = await this.cartDao.deleteById(cartId);
            return result;
        } catch (error) {
            throw new Error(`Error al eliminar el carrito con id ${cartId}: ${error.message}`);
        }
    }


    // Eliminar un producto del carrito
    async removeProductFromCart(cartId, productId) {
        try {
            return await this.cartDao.removeProductFromCart(cartId, productId);
        } catch (error) {
            console.error("Error en repository al eliminar producto del carrito: ", error);
            throw error;
        }
    }

}

export default new CartRepository();
