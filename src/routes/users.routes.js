import { Router } from 'express';
import { registerUser } from '../controllers/users.controllers.js'; // Traemos el controlador

const router = Router();

// Ruta de registro
router.post('/register', registerUser); // Ruta para registrar usuarios


export default router;
