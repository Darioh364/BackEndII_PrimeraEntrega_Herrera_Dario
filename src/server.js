import express from 'express'
import mongoose from 'mongoose'
import { create } from 'express-handlebars'
import { Server } from 'socket.io'
import path from 'path'
import { __dirname } from './path.js'
import productRouter from './routes/productos.routes.js'
import cartRouter from './routes/carritos.routes.js'
import multerRouter from './routes/imagenes.routes.js'
import chatRouter from './routes/chat.routes.js'
import { getProducts } from './controllers/products.controllers.js'
import usersRouter from './routes/users.routes.js' // Importar las rutas de usuarios
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import session from 'express-session';
import sessionRouter from './routes/sessions.router.js';
import dotenv from 'dotenv';
import config from './config/config.js';
dotenv.config(); // Esto carga las variables de entorno del archivo .env




const app = express()
const hbs = create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
    }
})
const PORT = 8080

const server = app.listen(PORT, () => {
    console.log("Server on port", PORT)
})

// Conectar a la base de datos de MongoDB Atlas
await mongoose.connect(config.mongoUrl)
    .then(() => console.log("BDD conectada"))
    .catch((e) => console.log("Error al conectar con bdd: ", e))

// Inicializar Socket.io en el servidor
const io = new Server(server)

// Middlewares de aplicación
app.use(express.json()) // Para manejar JSON en las peticiones
app.use(express.urlencoded({ extended: true }))



app.use(session({
    secret: 'coderSecret',
    resave: false,
    saveUninitialized: false
}));

initializePassport(); // Inicializás la estrategia
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/sessions', sessionRouter);


// Configuración de hbs para localización de plantillas y extensión de archivo
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

// Establecer el directorio de las vistas
app.set('views', path.join(__dirname, 'views'))

// Rutas de mi aplicación
app.use('/public', express.static(__dirname + '/public')) // Definir la carpeta pública como destino de los archivos estáticos
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/chat', chatRouter)
app.use('/upload', multerRouter)
app.get('/', getProducts)
// Rutas de usuarios
app.use('/api/users', usersRouter) // Usar las rutas de usuarios

let mensajes = []

// Conexiones de socket.io
io.on('connection', (socket) => {
    console.log('Usuario conectado: ', socket.id)

    socket.on('mensaje', (data) => {
        console.log('Mensaje recibido: ', data)
        mensajes.push(data)
        socket.emit('respuesta', mensajes)
    })

    socket.on('disconnect', () => {
        console.log('Usuario desconectado: ', socket.id)
    })
})
