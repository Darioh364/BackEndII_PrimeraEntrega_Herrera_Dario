import orderModel from "../models/order.model.js";

class OrderDao {
    // Método para obtener todos los pedidos
    async getAll() {
        try {
            const orders = await orderModel.find(); // Devuelve todos los pedidos
            return orders;
        } catch (error) {
            throw new Error("Error al obtener los pedidos");
        }
    }

    // Método para obtener un pedido por su ID
    async getById(orderId) {
        try {
            const order = await orderModel.findById(orderId); // Busca un pedido por ID
            if (!order) {
                throw new Error("Pedido no encontrado");
            }
            return order;
        } catch (error) {
            throw new Error("Error al obtener el pedido por ID");
        }
    }

    // Método para crear un nuevo pedido
    async create(orderData) {
        try {
            const order = new orderModel(orderData);
            await order.save(); // Guarda el pedido en la base de datos
            return order;
        } catch (error) {
            throw new Error("Error al crear el pedido");
        }
    }

    // Método para actualizar un pedido
    async update(orderId, orderData) {
        try {
            const order = await orderModel.findByIdAndUpdate(orderId, orderData, { new: true });
            if (!order) {
                throw new Error("Pedido no encontrado para actualizar");
            }
            return order;
        } catch (error) {
            throw new Error("Error al actualizar el pedido");
        }
    }

    // Método para eliminar un pedido
    async delete(orderId) {
        try {
            const order = await orderModel.findByIdAndDelete(orderId);
            if (!order) {
                throw new Error("Pedido no encontrado para eliminar");
            }
            return order;
        } catch (error) {
            throw new Error("Error al eliminar el pedido");
        }
    }
}

export default OrderDao;
