import CartRepository from "../repository/CartRepository.js"; 
import Ticket from '../models/ticket.model.js';


export const getCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await CartRepository.getCartById(cartId); // Usamos el repository en lugar de model

        if (cart) {
            res.status(200).render('templates/carts', {
                carts: cart.products // Accede a la propiedad 'products' que contiene los productos en el carrito
            });
        } else {
            res.status(404).send("Carrito no encontrado");
        }

    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
};

export const createCart = async (req, res) => {
    try {
        const newCart = await CartRepository.createCart(); // Usamos el repository
        res.status(201).send(newCart);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
};

export const insertProductCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;

        const cart = await CartRepository.getCartById(cartId); // Usamos el repository

        if (cart) {
            const updatedCart = await CartRepository.addProductToCart(cartId, productId, quantity); // Usamos el repository para actualizar el carrito
            res.status(200).send(updatedCart);
        } else {
            res.status(404).send("Carrito no existe");
        }
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
};

export const updateQuantityProductCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;

        const updatedCart = await CartRepository.updateProductQuantity(cartId, productId, quantity); // Usamos el repository
        if (updatedCart) {
            res.status(200).send(updatedCart);
        } else {
            res.status(404).send("Producto no encontrado");
        }
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
};

export const deleteProductCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const updatedCart = await CartRepository.removeProductFromCart(cartId, productId); // Usamos el repository
        if (updatedCart) {
            res.status(200).send(updatedCart);
        } else {
            res.status(404).send("Producto no encontrado");
        }
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
};

export const deleteCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const deletedCart = await CartRepository.deleteCart(cartId); // Usamos el repository
        if (deletedCart) {
            res.status(200).send(deletedCart);
        } else {
            res.status(404).send("Carrito no encontrado");
        }
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
};

export const purchaseCart = async (req, res) => {
    try {
        const cartId = req.params.cid;

        const cart = await CartRepository.getCartById(cartId);

        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }

        const noStockProducts = [];
        const purchasableProducts = [];
        let totalAmount = 0;

        for (const item of cart.products) {
            const product = item.id_prod;
            const quantity = item.quantity;

            if (product.stock >= quantity) {
                product.stock -= quantity;
                totalAmount += product.price * quantity;

                await product.save();
                purchasableProducts.push(item); // Se puede comprar, se guarda para el ticket
            } else {
                noStockProducts.push(product._id); // No hay stock suficiente
            }
        }

        // Solo creamos ticket si hay productos que pudieron comprarse
        let ticket = null;
        if (purchasableProducts.length > 0) {
            ticket = new Ticket({
                code: `TICKET-${Date.now()}`,
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: req.user.email,
            });

            await ticket.save();
        }

        // Eliminar del carrito los productos que se compraron
        cart.products = cart.products.filter(item =>
            noStockProducts.includes(item.id_prod._id)
        );

        await cart.save();

        res.status(200).json({
            message: purchasableProducts.length > 0
                ? "Compra procesada parcialmente o completamente"
                : "No se pudo procesar ningún producto por falta de stock",
            ticket,
            noStockProducts
        });
    } catch (e) {
        console.log(e);
        res.status(500).send('Error al procesar la compra');
    }
};

