import jwt from 'jsonwebtoken';
import UserDao from '../dao/UserDao.js';
import config from '../config/config.js';

// Middleware de autorización
export const authorizationMiddleware = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.header('Authorization');
      console.log('Encabezado Authorization:', authHeader);

      const token = authHeader?.replace('Bearer ', '');
      console.log('Token recibido:', token);

      if (!token) {
        console.log('No se proporcionó token');
        return res.status(401).json({ status: 'error', message: 'Acceso no autorizado' });
      }

      const decoded = jwt.verify(token, config.jwtSecret);
      console.log('Token decodificado:', decoded);

      const user = await UserDao.getById(decoded.id);
      console.log('Usuario encontrado en la base de datos:', user);

      if (!user) {
        console.log('No se encontró un usuario con ese email');
        return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
      }

      if (user.role !== requiredRole) {
        console.log(`Rol incorrecto: se requiere "${requiredRole}" pero el usuario tiene "${user.role}"`);
        return res.status(403).json({ status: 'error', message: 'Acceso denegado' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Error en la autorización:', error);
      return res.status(500).json({ status: 'error', message: 'Error en la autorización' });
    }
  };
};
