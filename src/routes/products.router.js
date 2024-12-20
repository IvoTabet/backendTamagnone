import { Router } from "express";
import fs from 'fs';
import crypto from 'crypto'

const routerProds = Router()

let products = []

// Cargar productos desde el archivo JSON
fs.readFile('src/products.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error al leer el archivo:', err);
        return;
    }
    products = JSON.parse(data); // Parsear el contenido JSON
    products = products.map(prod => ({
        ...prod,
        id: crypto.randomBytes(8).toString('hex') // Generar un ID único
    }));
});

routerProds.get('/', (req, res, next)=>{
    let {category} = req.query
    let prodsFiltrados = products.filter(prod=>prod.category.toLowerCase()===category)

    // Verificar si prodsFiltrados está vacío o undefined
    if (!prodsFiltrados || prodsFiltrados.length === 0) {
        prodsFiltrados = products; // Asignar todos los productos si no hay coincidencias
    }
    
    res.status(200).send(prodsFiltrados)
})

routerProds.get('/:pid', (req, res)=>{
    const productId = req.params.pid 
    const producto = products.find(prod => prod.id === productId)
    if(producto){
        res.status(200).send(producto)
    }else{
        res.status(404).send("el producto no existe")
    }
})

routerProds.post('/', (req, res, next)=>{
    let {title, description, price, stock, code, status, category} = req.body
    const newProduct = {
        id: crypto.randomBytes(8).toString('hex'),
        title: title,
        description: description,
        price: price,
        stock: stock,
        code: code,
        status: status,
        category: category
    }
    products.push(newProduct)
    res.status(201).send(`Producto creado con el id: ${newProduct.id}`)
})
routerProds.put('/:pid', (req, res, next)=>{
    const productId = req.params.pid 
    let {title, description, price, stock, code, status, category} = req.body

    const index = products.findIndex(prod => prod.id === productId)
    
    if(index != -1){
        products[index].title = title
        products[index].description = description
        products[index].price = price
        products[index].stock = stock
        products[index].code = code
        products[index].status = status
        products[index].category = category
        res.status(200).send("Producto actualizado correctamente")
    }else{
        res.status(404).send("el producto no existe")
    }
})
routerProds.delete('/:pid', (req, res, next)=>{
    const productId = req.params.pid 
    //const producto = products.find(prod => prod.id === productId)
    const index = products.findIndex(prod => prod.id === productId)
    if(index != -1){
        products.splice(index, 1)
        res.status(200).send("Producto eliminado")
    }else{
        res.status(404).send("el producto no existe")
    }
})

export default routerProds