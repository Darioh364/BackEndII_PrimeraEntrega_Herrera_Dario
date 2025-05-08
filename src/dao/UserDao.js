// UserDao.js

import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  cart: { type: Schema.Types.ObjectId, ref: 'carts' },
  role: { type: String, default: 'user' },
});

const UserModel = model('users', userSchema);

export default class UserDao {
  async getByEmail(email) {
    return await UserModel.findOne({ email }).lean();  
  }

  async create(userData) {
      // Aquí, se asegura que el objeto creado sea un documento Mongoose
      const newUser = await UserModel.create(userData);
      return newUser;  // El objeto creado es un documento de Mongoose
  }

  async getById(id) {
    return await UserModel.findById(id).lean(); 
  }

  async updatePassword(id, newPassword) {
    return await UserModel.findByIdAndUpdate(id, { password: newPassword });
  }
}
