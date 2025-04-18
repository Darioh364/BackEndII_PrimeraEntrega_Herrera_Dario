import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = Router();

// Registro
router.post('/register', passport.authenticate('register', {
    failureRedirect: '/api/sessions/failregister'
}), (req, res) => {
    res.send({ status: "success", message: "Usuario registrado correctamente" });
});

router.get('/failregister', (req, res) => {
    res.status(400).send({ status: "error", message: "Falló el registro" });
});

//Login
router.post('/login', passport.authenticate('login', { session: false }), (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.send({ status: "success", message: "Login exitoso", token });
});

//Ruta protegida con JWT
router.get(
    '/current',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      res.send({
        status: 'success',
        payload: req.user,  // Aquí ya tendrás el usuario correctamente autenticado
        message: 'Usuario autenticado correctamente',
      });
    }
);
export default router;
