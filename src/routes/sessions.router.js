import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/UserDto.js';

const router = Router();

// Registro
router.get('/register', (req, res) => {
    res.render('./templates/register'); 
});

router.post('/register', passport.authenticate('register', {
    failureRedirect: '/api/sessions/failregister'
}), (req, res) => {
    res.send({ status: "success", message: "Usuario registrado correctamente" });
});

router.get('/failregister', (req, res) => {
    res.status(400).send({ status: "error", message: "Falló el registro" });
});

// Login
router.get('/login', (req, res) => {
    res.render('./templates/login'); // Renderiza la vista "login.handlebars"
});

router.post('/login', passport.authenticate('login', { session: false }), (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.send({ status: "success", message: "Login exitoso", token });
});

// Ruta protegida con JWT
router.get('/current', passport.authenticate('jwt', { session: false }),
    (req, res) => {
        try {
            // Creamos un DTO con la información del usuario
            const userDto = new UserDTO(req.user);

            // Enviar solo los datos del DTO
            res.send({
                status: 'success',
                payload: userDto,  // Usamos el DTO para enviar solo los datos necesarios
                message: 'Usuario autenticado correctamente',
            });
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener la información del usuario' });
        }
    }
);

export default router;
