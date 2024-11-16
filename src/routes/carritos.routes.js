import {Router} from 'express';
import crypto from 'crypto'

const cartRouter = Router()

const carritos = []

cartRouter.get('/:cid', (req,res) => {
    const idCarrito = req.params.cid
    const carrito = carritos.find(cart => cart.id == idCarrito)

    if(carrito) {
        res.status(200).send(carrito.products)
    } else {
        res.status(404).send({mensaje: "El carrito no existeee"})
    }
})

//crea un nuevo carrito
cartRouter.post('/', (req,res) => {
    const newCart = {
        id: crypto.randomBytes(5).toString('hex'),
        products: []
    }

    carritos.push(newCart)
    res.status(200).send( `Carrito creado correctamente con el id ${newCart.id}`)
})

cartRouter.post('/:cid/products/:pid', (req,res) => {
    const idCarrito = req.params.cid
    const idProducto = req.params.pid
    const {quantity} = req.body
    const carrito = carritos.find(cart => cart.id == idCarrito)

    if(carrito) {
        const indice = carrito.products.findIndex(prod => prod.id == idProducto)
        if(indice != -1){
            carrito.products[indice].quantity = quantity
        }else {
            carrito.products.push({id: idProducto, quantity: quantity })
        }
        res.status(200).send("Carrito actualizado correctamente")
    } else {
        res.status(404).send({mensaje: "El carrito no existe"})
    }
})

export default cartRouter