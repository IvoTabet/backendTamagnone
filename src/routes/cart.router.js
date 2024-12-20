import { Router } from "express";
import crypto from 'crypto'


const routerCart = Router()

let carts = []

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
    res.status(201).send(`carrito creado exitosamente con id: ${newCart.id}`)
})

routerCart.post('/:cid/products/:pid', (req, res, next)=>{
    const cartID = req.params.cid
    const prodID = req.params.pid
    let {quantity} = req.body
    
    const cart = carts.find(elem=>elem.id===cartID)
    if (!cart){
        return res.status(404).send("no existe el carrito al que desea agregar los productos, por favor ingrese el id correcto")
    }

    const addProd = {
        product: prodID,
        quantity: quantity
    }
    cart.products.push(addProd)
       
    res.status(200).send(`Producto ${prodID} agregado exitosamente al carrito ${cartID}`)
})


export default routerCart