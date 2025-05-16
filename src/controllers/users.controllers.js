import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserDao from '../dao/UserDao.js';
import config from '../config/config.js';


export const resetPassword = async (token, newPassword, res) => {
  try {
    // Verificamos el token
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Buscamos al usuario por su email
    const user = await UserDao.getByEmail(decoded.email);
    if (!user) {
      return res.status(404).send({ status: 'error', message: 'Usuario no encontrado' });
    }

    // Actualizamos la contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10); // Encriptamos la nueva contraseña
    user.password = hashedPassword;
    await user.save();

    res.send({ status: 'success', message: 'Contraseña actualizada correctamente' });

  } catch (error) {
    console.error(error); // Esto puede dar más detalles sobre el error
    res.status(500).send({ status: 'error', message: 'Error al restablecer la contraseña', error: error.message });
  }
};

