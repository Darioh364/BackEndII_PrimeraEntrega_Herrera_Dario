import userModel from '../models/user.model.js';

class UserDao {
  async getByEmail(email) {
    return await userModel.findOne({ email }); 
  }

  async create(userData) {
      // Aquí, se asegura que el objeto creado sea un documento Mongoose
      const newUser = await userModel.create(userData);
      return newUser;  // El objeto creado es un documento de Mongoose
  }

  async getById(id) {
    return await userModel.findById(id).lean(); 
  }

  async updatePassword(id, newPassword) {
    return await userModel.findByIdAndUpdate(id, { password: newPassword });
  }
}

export default new UserDao();