import { Router } from "express"
import fs from 'fs'
import crypto from 'crypto'


const routerCart = Router()

let carts = []

const saveCartsToFile = () => {
    fs.writeFile('src/cart.json', JSON.stringify(carts, null, 2), (err) => {
        if (err) {
            console.error('Error al guardar los carritos:', err);
        }
    });
};

// Cargar productos desde el archivo JSON
fs.readFile('src/cart.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error al leer el archivo:', err);
        return;
    }
    carts = JSON.parse(data); // Parsear el contenido JSON
});

routerCart.get('/', (req, res, next)=>{
    res.send(carts)
})

routerCart.get('/:cid', (req, res, next)=>{
    const cartID = req.params.cid
    const cart = carts.find(elem => elem.id === cartID)
    if(cart){
        res.status(200).send(cart)
    }else{
        res.status(404).send("el carrito no existe")
    }
    res.status(200).send(carts)
})

routerCart.post('/', (req, res, next)=>{
    const newCart = {
        id: crypto.randomBytes(8).toString('hex'),
        products: []      
    }
    carts.push(newCart)
    saveCartsToFile()
    res.status(201).send(`carrito creado exitosamente con id: ${newCart.id}`)
})

routerCart.post('/:cid/products/:pid', (req, res, next)=>{
    const cartID = req.params.cid
    const prodID = req.params.pid
    let {quantity} = req.body
    
    const cart = carts.find(elem=>elem.id===cartID)
    if (!cart){
        return res.status(404).send("No existe el carrito al que desea agregar los productos, por favor ingrese el id correcto")
    }
    
    
    const existingProduct = cart.products.find(prod => prod.product === prodID)
    if (existingProduct) {

        const newQuantity = existingProduct.quantity + quantity

        existingProduct.quantity = newQuantity
    } else {

        const addProd = {
            product: prodID,
            quantity: quantity
        }
        cart.products.push(addProd)
    }

    saveCartsToFile()
    res.status(200).send(`Producto ${prodID} agregado exitosamente al carrito ${cartID}`)
})


export default routerCart