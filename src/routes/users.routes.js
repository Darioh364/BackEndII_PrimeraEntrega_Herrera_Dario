import { Router } from 'express';
import passport from 'passport';
import { sendPasswordResetEmail } from '../services/mailService.js'; // este archivo lo vamos a crear
import { resetPassword } from '../controllers/users.controllers.js'; // Importamos la función de restablecimiento de contraseña
import jwt from 'jsonwebtoken';
import UserDao from '../dao/UserDao.js'; // ajustá si tu DAO de usuarios tiene otro nombre
import bcrypt from 'bcrypt';

const router = Router();

// Ruta de registro
router.post(
  '/register',
  passport.authenticate('register', { session: false }),
  (req, res) => {
    res.status(201).json({ message: 'Usuario creado con Passport', user: req.user });
  }
);

// Ruta de recuperación de contraseña
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send({ status: 'error', message: 'Se requiere un email' });
    }

    const user = await UserDao.getByEmail(email);
    if (!user) {
        return res.status(404).send({ status: 'error', message: 'Usuario no encontrado' });
    }

    const token = jwt.sign(
        { email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    const recoveryLink = `http://localhost:8080/reset-password?token=${token}`;

    await sendPasswordResetEmail(user.email, recoveryLink);

    res.send({ status: 'success', message: 'Correo de recuperación enviado' });
});

// Ruta de restablecimiento de contraseña
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).send({ status: 'error', message: 'Se requiere el token y la nueva contraseña' });
    }

    // Verificamos si la nueva contraseña es la misma que la actual
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserDao.getByEmail(decoded.email);
    if (!user) {
        return res.status(404).send({ status: 'error', message: 'Usuario no encontrado' });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
        return res.status(400).send({ status: 'error', message: 'La nueva contraseña no puede ser la misma que la actual' });
    }

    // Si la contraseña no es la misma, llamamos al controlador para manejar el restablecimiento
    await resetPassword(token, newPassword, res);
});


export default router;
