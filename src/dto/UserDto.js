export default class UserDTO {
    constructor(user) {
      // Verificamos que los campos sean correctos
      this.name = user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : "No disponible";
      this.age = user.age;
      this.role = user.role;
    }
  
    toJSON() {
      return {
        name: this.name,
        age: this.age,
        role: this.role
      };
    }
  }
  