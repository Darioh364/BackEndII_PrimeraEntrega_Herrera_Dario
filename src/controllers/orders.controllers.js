import OrderRepository from "../repository/OrderRepository.js";

// Obtener órdenes (con la lógica de agregación)
export const getOrders = async (req, res) => {
    try {
        // Utilizamos el repositorio para obtener el reporte
        const orders = await OrderRepository.getOrdersReport();
        
        res.status(200).send("Reportes generados");
    } catch (e) {
        console.log(e);
        res.status(500).send("Error al consultar ordenes:");
    }
};

// Crear una orden
export const createOrder = async (req, res) => {
    try {
        const order = req.body;

        // Utilizamos el repositorio para crear la orden
        const respuesta = await OrderRepository.createOrder(order);

        console.log(respuesta);
        res.status(201).send("Orden creada correctamente");
    } catch (e) {
        console.log(e);
        res.status(500).send("Error al crear Orden: ", e);
    }
};
