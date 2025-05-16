export default class ProductDto {
    constructor(product) {
      this.title = product.title || "No disponible";
      this.description = product.description || "No disponible";
      this.category = product.category || "No disponible";
      this.price = product.price ?? 0;
      this.code = product.code || "Sin código";
    }
  }
  