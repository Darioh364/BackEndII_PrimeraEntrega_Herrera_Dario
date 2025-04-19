import bcrypt from 'bcrypt';
import { userModel } from '../models/user.model.js'; 

export const registerUser = async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, 10); // Encripto la contraseña

    const newUser = await userModel.create({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'Usuario creado', user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
};
