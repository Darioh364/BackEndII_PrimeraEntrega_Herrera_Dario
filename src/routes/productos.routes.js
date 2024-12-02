import {Router} from 'express'
import crypto from 'crypto'
import {__dirname} from '../path.js'
import {promises as fs} from 'fs';
import path from 'path';

const productRouter = Router()

const productosPath = path.resolve(__dirname, '../src/db/productos.json'); //Dada una ruta, las concateno entre si (evito utiliza el +), evito error por / o \

// Leer el archivo
const productosData = await fs.readFile(productosPath, 'utf-8');
const productos = JSON.parse(productosData); //Para no consultar todo el tiempo al json, lo guardo en una variable

// Consultar productos
productRouter.get('/', (req,res) => {
    const {limit} = req.query
    const products = productos.slice(0, limit) //Devuelve una copia de un array (inicio, fin)
    res.status(200).render('templates/home', {productos: products, js: 'productos.js', css: 'productos.css'})
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
productRouter.post('/', async (req,res) => {
const {title, description, code, price, category, stock, status} = req.body

// Validaciones simples
if (!title) {
    return res.status(400).json({ error: "El título es obligatorio y debe ser un texto." });
}
if (!description) {
    return res.status(400).json({ error: "La descripción es obligatoria y debe ser un texto." });
}
if (!code) {
    return res.status(400).json({ error: "El código es obligatorio y debe ser un texto." });
}
if (!category) {
    return res.status(400).json({ error: "La categoría es obligatoria y debe ser un texto." });
}
if (!price || typeof price !== "number" || price <= 0) {
    return res.status(400).json({ error: "El precio debe ser un número mayor a 0." });
}
if (stock === undefined || typeof stock !== "number" || !Number.isInteger(stock) || stock < 0) {
    return res.status(400).json({ error: "El stock debe ser un número entero mayor o igual a 0." });
}

   const nuevoProducto = {
        id: crypto.randomBytes(10).toString('hex'), //Me genera un id unico
        title: title,
        description: description,
        code: code,
        category: category,
        price: price,
        stock: stock,
        status: status,
        thumbnails: []
   }
   productos.push(nuevoProducto)
   await fs.writeFile(productosPath, JSON.stringify(productos)) //Guardo en el archivo json el nuevo producto 
   res.status(201).send({mensaje: `Producto creado correctamente con el id: ${nuevoProducto.id}`})
})

//Actualiza un producto dado su id y pido los datos a actualizar del cuerpo de la peticion
productRouter.put('/:pid', async (req,res) => {
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
        await fs.writeFile(productosPath, JSON.stringify(productos))
        res.status(200).send({mensaje: "Producto actualizado"})
    } else {
        res.status(404).send({mensaje: "El producto no existe"})
    }
})

//Elimina un producto dado su id
productRouter.delete('/:pid', async (req,res) => {
    const idProducto = req.params.pid
    const indice = productos.findIndex(prod => prod.id == idProducto)
    if(indice != -1) {
        productos.splice(indice, 1)
        await fs.writeFile(productosPath, JSON.stringify(productos))
        res.status(200).send({mensaje: 'Producto eliminado'})
    } else {
        res.status(404).send({mensaje: "El producto no existe"})
    }
})

export default productRouter