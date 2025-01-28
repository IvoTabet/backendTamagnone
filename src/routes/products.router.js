import { Router } from "express"
import fs from 'fs'
import crypto from 'crypto'
import { productsModel } from "../models/products.model.js"

const routerProds = Router()
let products = []

const saveProductsToFile = () => {
    fs.writeFile('src/products.json', JSON.stringify(products, null, 2), (err) => {
        if (err) {
            console.error('Error al guardar los productos:', err);
        }
    });
};

const fetchData = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('src/products.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error al leer el archivo:', err);
                reject(err);
            } else {
                products = JSON.parse(data);
                resolve(products);
            }
        });
    });
}

const productsRouter = (ioServer) =>{

    routerProds.get('/', async (req, res) => {
        try {
            const { limit, page, query, value, sort } = req.query; 
            const filter = {};
            const sorted = {
                'asc': {price: 1},
                'desc': {price: -1},
                default: 0
            }
            
            if (query && value) {
                if (query === 'status') {
                    filter.status = (value === 'true'); 
                } else if (query === 'category') {
                    filter.category = value; 
                }
            }

            const opcion = {
                limit: limit || 10,
                page: page || 1, 
                ...(sort ? {sort: sorted[sort] || sorted.default}:{})
            }

            let prodsFiltrados = await productsModel.paginate(filter, opcion);
            console.log(prodsFiltrados);
            
            const response = {
                payload: prodsFiltrados.docs,
                prevLink: `?page=${prodsFiltrados.prevPage}`,
                nextLink: `?page=${prodsFiltrados.nextPage}`

            }
            res.status(200).send(response);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            res.status(500).send('Error al obtener productos');
        }
    });
    
    
    routerProds.get('/:pid', async (req, res)=>{
        try {
            products = await productsModel.find()
            const productId = req.params.pid 
            const producto = products.find(prod => prod.id === productId)
            if(producto){
                res.status(200).send(producto)
            }else{
                res.status(404).send("el producto no existe")
            }
        } catch (error) {
            
        }

        
    })
    
    routerProds.post('/', async (req, res, next)=>{
        try {
            await fetchData()
            let { title, description, price, stock, code, status, category } = req.body;
    
            if (!title || !description || !price || !stock || !code || status === undefined || !category) {
                return res.status(400).send("Todos los campos son obligatorios: title, description, price, stock, code, status, category.");
            }
        
            const newProduct = await productsModel.create({
                id: crypto.randomBytes(8).toString('hex'),
                title: title,
                description: description,
                price: price,
                stock: stock,
                code: code,
                status: status,
                category: category
            })
            products.push(newProduct);
            saveProductsToFile();
            ioServer.emit('prodCreated', products)
            res.status(201).send(`Producto creado con el id: ${newProduct.id}`);
        } catch (error) {
            
        }
        
    })
    
    routerProds.put('/:pid', async (req, res, next)=>{
        try {
            await fetchData()
            const productId = req.params.pid 
            let {title, description, price, stock, code, status, category} = req.body
        
            const index = products.findIndex(prod => prod._id === productId)
            
            if(index != -1){
                const updatedProduct = await productsModel.updateOne(
                    {_id: productId},
                    {$set:{
                        title,
                        description, 
                        price, 
                        stock, 
                        code,
                        status, 
                        category
                    }}
                ) 
                if(updatedProduct.modifiedCount > 0){
                    products[index] = {...products[index], title, description, price, stock, code, status, category}
                    saveProductsToFile()
                    ioServer.emit('prodCreated', products)
                    res.status(200).send("Producto actualizado correctamente")
                }else{
                    res.status(400).send('no se puede actualizar el producto')
                }
                
            }else{
                res.status(404).send("el producto no existe")
            }
        } catch (error) {
            res.status(500).send("Error al actualizar el producto");
        }
        
    })
    
    routerProds.delete('/:pid', async (req, res, next)=>{
        try {
            await fetchData()
            const productId = req.params.pid 
            const index = products.findIndex(prod => prod.id === productId)
            if(index != -1){
                products[index].status = false
                saveProductsToFile()
                ioServer.emit('prodCreated', products)
                res.status(200).send("Producto eliminado")
            }else{
                res.status(404).send("el producto no existe")
            }
        } catch (error) {
            
        }
        
    
    })
    return routerProds
}



export default productsRouter