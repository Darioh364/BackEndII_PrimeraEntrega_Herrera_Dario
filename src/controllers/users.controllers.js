import bcrypt from 'bcrypt';
import UserRepository from '../repository/UserRepository.js';


const userRepository = new UserRepository();

export const registerUser = async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Crear el nuevo usuario
    const newUser = await userRepository.createUser({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
    });

    // Retornar la respuesta con el DTO
    res.status(201).json({ message: 'Usuario creado', user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
};
