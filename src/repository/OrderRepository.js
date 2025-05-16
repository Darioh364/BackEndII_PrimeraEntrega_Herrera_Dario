import OrderDao from "../dao/OrderDao.js";

class OrderRepository {
    constructor() {
        this.orderDao = new OrderDao();  // Instanciamos el OrderDao
    }

    // Obtener todos los pedidos
    async getAllOrders() {
        try {
            const orders = await this.orderDao.getAll();
            return orders;
        } catch (error) {
            throw new Error("Error al obtener los pedidos desde el repository");
        }
    }

    // Obtener un pedido por su ID
    async getOrderById(orderId) {
        try {
            const order = await this.orderDao.getById(orderId);
            return order;
        } catch (error) {
            throw new Error("Error al obtener el pedido por ID desde el repository");
        }
    }

    // Crear un nuevo pedido
    async createOrder(orderData) {
        try {
            const order = await this.orderDao.create(orderData);
            return order;
        } catch (error) {
            throw new Error("Error al crear el pedido desde el repository");
        }
    }

    // Actualizar un pedido existente
    async updateOrder(orderId, orderData) {
        try {
            const updatedOrder = await this.orderDao.update(orderId, orderData);
            return updatedOrder;
        } catch (error) {
            throw new Error("Error al actualizar el pedido desde el repository");
        }
    }

    // Eliminar un pedido
    async deleteOrder(orderId) {
        try {
            const deletedOrder = await this.orderDao.delete(orderId);
            return deletedOrder;
        } catch (error) {
            throw new Error("Error al eliminar el pedido desde el repository");
        }
    }
}

export default OrderRepository;
