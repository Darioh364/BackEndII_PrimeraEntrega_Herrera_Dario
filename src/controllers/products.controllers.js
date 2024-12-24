import productModel from "../models/product.model.js";

export const getProducts = async (req, res) => {
    try {
        const { limit, page, filter, metFilter, ord } = req.query;

        const pag = page !== undefined ? page : 1 //Si la pagina es ingresada, consulto por ella sino es 1
        const lim = limit !==  undefined ? limit : 10
        const query = metFilter  !== undefined ? {[metFilter]: filter} : {} //Mandar status o category como metodo de filtro
        const orQuery = ord !== undefined ? {price: ord} : {} //mandar asc o desc

        const prods = await productModel.paginate(query, {
            limit: lim,
            page: pag,
            sort: orQuery,
        });

        res.status(200).render('templates/home', {
            productos: prods.docs,  // Solo los productos
            pagination: {
                hasPrevPage: prods.hasPrevPage,
                hasNextPage: prods.hasNextPage,
                prevPage: prods.prevPage,
                nextPage: prods.nextPage,
            },
            js: 'productos.js',
            css: 'productos.css',
        });
    } catch (e) {
        console.error("Error al consultar productos: ", e);
        res.status(500).send("Error al consultar productos");
    }
};



export const getProduct = async (req, res) => {
    try {
        const idProd = req.params.pid
        const prod = await productModel.findById(idProd)
        console.log(prod)
        if (prod){
            res.status(200).render('templates/producto', {
            prod  // Solo los productos
        });
        }else{
            res.status(404).send("Producto no existe")  
        }      
    }catch (e) {
    res.status(500).send("Error al consultar producto: ", e)
}
}

export const createProduct = async (req, res) => {
    try {
        const product = req.body
        const respuesta = await productModel.create(product)
        console.log(respuesta);
        res.status(201).send("Producto creado correctamente")
    } catch (e) {
        console.log(e);

        res.status(500).send("Error al crear producto: ", e)
    }
}

export const updateProduct = async (req, res) => {
    try {
        const idProd = req.params.pid
        const updateProduct = req.body
        const respuesta = await productModel.findByIdAndUpdate(idProd, updateProduct)
        res.status(200).send("Producto actualizado correctamente")
    } catch (e) {
        console.log(e);

        res.status(500).send("Error al actualizar producto: ", e)
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const idProd = req.params.pid
        const respuesta = await productModel.findByIdAndDelete(idProd)
        res.status(200).send("Producto eliminado correctamente")
    } catch (e) {
        res.status(500).send("Error al eliminar producto: ", e)
    }
}