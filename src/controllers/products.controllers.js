import ProductRepository from "../repository/ProductRepository.js";

const productRepository = new ProductRepository();

export const getProducts = async (req, res) => {
    try {
        const { limit, page, filter, metFilter, ord } = req.query;

        const pag = page !== undefined ? page : 1;
        const lim = limit !==  undefined ? limit : 10;
        const query = metFilter !== undefined ? {[metFilter]: filter} : {}; // Filtro dinámico
        const orQuery = ord !== undefined ? {price: ord} : {}; // Ordenación asc/desc

        // Llamamos al repositorio para obtener los productos paginados
        const prods = await productRepository.getProducts({ query, limit: lim, page: pag, orQuery });

        console.log(prods);

        res.status(200).render('templates/home', {
            productos: prods.docs,
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
        const idProd = req.params.pid;

        // Llamamos al repositorio para obtener el producto por ID
        const prod = await productRepository.getProduct(idProd);
        
        console.log(prod);

        if (prod) {
            res.status(200).render('templates/producto', {
                prod  // Solo los productos
            });
        } else {
            res.status(404).send("Producto no existe");
        }      
    } catch (e) {
        console.error("Error al consultar producto: ", e);
        res.status(500).send("Error al consultar producto");
    }
};

export const createProduct = async (req, res) => {
    try {
        const product = req.body;   
        // Llamamos al repositorio para crear el producto
        const respuesta = await productRepository.createProduct(product);
        console.log(respuesta);
        res.status(201).send("Producto creado correctamente");
    } catch (e) {
        console.log(e);
        res.status(500).send("Error al crear producto");
    }
};

export const updateProduct = async (req, res) => {
    try {
        const idProd = req.params.pid;
        const updateProduct = req.body;
        
        // Llamamos al repositorio para actualizar el producto
        const respuesta = await productRepository.updateProduct(idProd, updateProduct);

        res.status(200).send("Producto actualizado correctamente");
    } catch (e) {
        console.log(e);
        res.status(500).send("Error al actualizar producto");
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const idProd = req.params.pid;

        // Llamamos al repositorio para eliminar el producto
        const respuesta = await productRepository.deleteProduct(idProd);

        res.status(200).send("Producto eliminado correctamente");
    } catch (e) {
        console.log(e);
        res.status(500).send("Error al eliminar producto");
    }
};
