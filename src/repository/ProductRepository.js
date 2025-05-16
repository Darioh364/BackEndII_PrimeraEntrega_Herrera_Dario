import ProductDao from "../dao/ProductDao.js";
import ProductDto from "../dto/ProductDto.js";

class ProductRepository {
  constructor() {
    this.dao = new ProductDao();
  }

  async getProducts() {
    const products = await this.dao.getAll();
    return products.map((p) => new ProductDto(p));
  }

  async getProduct(id) {
    const product = await this.dao.getById(id);
    return product ? new ProductDto(product) : null;
  }

  async createProduct(data) {
    const newProduct = await this.dao.create(data);
    return new ProductDto(newProduct);
  }

  async updateProduct(id, updates) {
    const updated = await this.dao.update(id, updates);
    return updated ? new ProductDto(updated) : null;
  }

  async deleteProduct(id) {
    return await this.dao.delete(id);
  }
}

export default ProductRepository;
