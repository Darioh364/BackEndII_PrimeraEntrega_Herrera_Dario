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
import orderRouter from './routes/orders.routes.js'

const app = express()
const hbs = create({
    layoutsDir: path.join(__dirname, 'views', 'layouts'), // Definir el directorio de los layouts
    defaultLayout: 'main', // El layout predeterminado es main.handlebars
    extname: '.handlebars', // Definir la extensión de archivo de los templates
  });
  
  app.engine('handlebars', hbs.engine);  // Definir el motor de plantillas
  app.set('view engine', 'handlebars');  // Definir la extensión por defecto
  app.set('views', path.join(__dirname, 'views'));  // Establecer el directorio de vistas
  
const PORT = 8080


const server = app.listen(PORT, () => {
    console.log("Server on port", PORT)
})

await mongoose.connect("mongodb+srv://darioh364:ZoeTeAmoMucho20@cluster0.aufua.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then( () => console.log("Base de Datos conectada"))
.catch((e) => console.log("Error al conectar con base de datos", e))


//Inicializo Socket.io en el servidor
const io = new Server(server)
//Middlewares de aplicacion
app.use(express.json()) //Para manejar JSON en las peticiones
app.use(express.urlencoded({extended: true}))
//Configuracion de hbs para localizacion de plantillas y extension de archivo


//Rutas de mi aplicacion
app.use('/public', express.static(__dirname + '/public'))//Defino la carpeta publica como destino de los archivos estaticos
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/chat', chatRouter)
app.use('/api/orders',orderRouter)
app.use('/upload', multerRouter)
app.get('/', (req, res) => {
    res.status(200).render('layouts/main');  // Renderiza 'main.handlebars' desde 'views/layouts'
});



let mensajes = []
//Conexiones de socket.io
//socket = info que llega de la conexion
io.on('connection', (socket) => { //Cuando se producza el "apreton de manos", puedo ejecutar las sigueintes funciones
    console.log('Usuario conectado: ', socket.id); //ID de conexion
    
    socket.on('mensaje', (data) => { //Cuando el usuario me envia un mensaje, trabajo con esos datos
        console.log('Mensaje recibido: ', data);
        mensajes.push(data)
        //Envia el array de mensajes
        socket.emit('respuesta', mensajes)
    })

    //Detectar desconexion
    socket.on('disconnect', ()=> {
        console.log('Usuario desconectado: ', socket.id);
        
    })
})

