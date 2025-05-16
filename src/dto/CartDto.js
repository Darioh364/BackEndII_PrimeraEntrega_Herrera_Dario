export default class CartDTO {
    constructor(cart) {
        this.id = cart._id;
        this.products = cart.products.map(prod => ({
            productId: prod.id_prod._id || prod.id_prod,
            title: prod.id_prod.title || null,
            price: prod.id_prod.price || null,
            quantity: prod.quantity
        }));
    }
}
