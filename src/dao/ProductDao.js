import productModel from '../models/product.model.js';

export default class ProductDao {
  // Obtener todos los productos con paginación
  async getAllPaginated(query = {}, options = {}) {
    return await productModel.paginate(query, options);
  }

  // Obtener todos los productos sin paginación
  async getAll() {
    return await productModel.find();
  }

  // Obtener un producto por ID
  async getById(id) {
    return await productModel.findById(id);
  }

  // Crear un nuevo producto
  async create(productData) {
    return await productModel.create(productData);
  }

  // Actualizar un producto por ID
  async update(id, updatedData) {
    return await productModel.findByIdAndUpdate(id, updatedData, { new: true });
  }

  // Eliminar un producto por ID
  async delete(id) {
    return await productModel.findByIdAndDelete(id);
  }
}
