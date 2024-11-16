import {Router} from 'express'
import crypto from 'crypto'

const productRouter = Router()

const productos = []

// Consultar productos
productRouter.get('/', (req,res) => {
    const {limit} = req.query
    const products = productos.slice(0, limit) // Devuelve la copia de un array
    res.status(200).send(products)
})

// Consultar producto via ID
productRouter.get('/:pid', (req,res) => {
    const idProducto = req.params.pid
    const producto = productos.find(prod => prod.id == idProducto)

    if(producto) {
        res.status(200).send(producto)
    } else {
        res.status(404).send({mensaje: "El producto no existe"})
    }
})

//Crear un nuevo producto
productRouter.post('/', (req,res) => {
   const {title, description, code, price, category, stock} = req.body
   const nuevoProducto = {
        id: crypto.randomBytes(10).toString('hex'), //Me genera un id unico
        title: title,
        description: description,
        code: code,
        category: category,
        price: price,
        stock: stock,
        status: true,
        thumbnails: []
   }
   productos.push(nuevoProducto)
   res.status(201).send({mensaje: `Producto creado correctamente con el id: ${nuevoProducto.id}`})
})

//Actualiza un producto dado su id y pido los datos a actualizar del cuerpo de la peticion
productRouter.put('/:pid', (req,res) => {
    const idProducto = req.params.pid
    const {title, description, code, price, category, stock, thumbnails, status} = req.body
    const indice = productos.findIndex(prod => prod.id == idProducto)
    
    if(indice != -1) {
        productos[indice].title = title
        productos[indice].description = description
        productos[indice].code = code
        productos[indice].price = price
        productos[indice].stock = stock
        productos[indice].status = status
        productos[indice].category = category
        productos[indice].thumbnails = thumbnails

        res.status(200).send({mensaje: "Producto actualizado"})
    } else {
        res.status(404).send({mensaje: "El producto no existe"})
    }
})

//Elimina un producto dado su id
productRouter.delete('/:pid', (req,res) => {
    const idProducto = req.params.pid
    const indice = productos.findIndex(prod => prod.id == idProducto)
    if(indice != -1) {
        productos.splice(indice, 1)
        res.status(200).send({mensaje: 'Producto eliminado'})
    } else {
        res.status(404).send({mensaje: "El producto no existe"})
    }
})

export default productRouter