import { Router } from "express"
import fs from 'fs'
import crypto from 'crypto'
import { cartsModel } from "../models/carts.model.js"
import { ObjectId } from 'mongodb'

const routerCart = Router()

let carts = []

const saveCartsToFile = () => {
    fs.writeFile('src/cart.json', JSON.stringify(carts, null, 2), (err) => {
        if (err) {
            console.error('Error al guardar los carritos:', err);
        }
    });
};

const fetchData = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('src/cart.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error al leer el archivo:', err);
                reject(err);
            } else {
                carts = JSON.parse(data);
                resolve(carts);
            }
        });
    });
}

routerCart.get('/', async (req, res, next)=>{
    try {
        const result = await cartsModel.find().populate('products.producto')
        res.json({result})
        /*await fetchData()
        res.send(carts)*/
    } catch (error) {
        res.status(400).send(error)
    }   
    
})

routerCart.get('/:cid', async (req, res, next)=>{
    try {
        //await fetchData()
        
        const cartID = req.params.cid
        const thisCart = await cartsModel.findById(cartID).populate('products.producto')
        /*const cart = carts.find(elem => elem.id === cartID)
        if(cart){
            res.status(200).send(cart)
        }else{
            res.status(404).send("el carrito no existe")
        }
        res.status(200).send(carts)*/
        res.json({thisCart})
    } catch (error) {
        res.status(400).send(error)
    }   
    
})

routerCart.post('/', async (req, res, next)=>{
    try {
        const {monto, fecha} = req.params
        const result = await cartsModel.create({
            fecha,
            monto
        })
        res.json({result})
        /*await fetchData()
        const newCart = {
            id: crypto.randomBytes(8).toString('hex'),
            products: []      
        }
        carts.push(newCart)
        saveCartsToFile()
        res.status(201).send(`carrito creado exitosamente con id: ${newCart.id}`)*/
    } catch (error) {
        res.status(400).send(error)
    }
    
})

routerCart.put('/', async (req, res)=>{
    try {
        const {id} = req.params
        /*const carrito = await cartsModel.findById('679784e01f2893941a30a1fb')
        console.log(carrito);        
        carrito.products.push({producto: '6795370b9a18eb09d366523a'})    
        const result = await cartsModel.updateOne({_id: '679784e01f2893941a30a1fb'}, carrito)
        res.json({result})*/
    } catch (error) {
        res.status(400).send(error)
    }
})

routerCart.post('/:cid/products/:pid', async (req, res, next)=>{
    try {
        //await fetchData()
        
        const cartID = req.params.cid
        const prodID = req.params.pid
        let {quantity} = req.body
        const thisCart = await cartsModel.findById(cartID)
        
        thisCart.products.push({producto: prodID, cantidad: quantity})
        
        await cartsModel.updateOne({_id: cartID}, thisCart)
        /*
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

        saveCartsToFile()*/
        
        res.status(200).send(`Producto ${prodID} agregado exitosamente al carrito ${cartID}`)
    } catch (error) {
        res.status(400).send(error)
    }
    
})

routerCart.delete('/:cid/products/:pid', async (req, res)=>{
    try {
        const cartID = req.params.cid
        const prodID = req.params.pid
        const thisCart = await cartsModel.findById(cartID)
        thisCart.products = thisCart.products.filter(prod => prod.producto.toString() !== new ObjectId(prodID).toString())
        const result = await cartsModel.updateOne({_id: cartID}, thisCart)
        res.json(result)
    } catch (error) {
        res.status(400).send(error)
    }
})

routerCart.put('/:cid/products/:pid', async (req, res)=>{
    try {
        const cartID = req.params.cid
        const prodID = req.params.pid
        const {quantity} = req.body
        const thisCart = await cartsModel.findById(cartID)
        
        const product = thisCart.products.find(prod => prod.producto.toString() === new ObjectId(prodID).toString())
        if (product) {
            product.cantidad += quantity 
            await cartsModel.updateOne({_id: cartID}, thisCart) 
            res.status(200).send(`El carrito ${cartID} ha sido actualizado exitosamente`)
        } else {
            res.status(404).send("Producto no encontrado en el carrito")
        }
    } catch (error) {
        res.status(400).send(error)
    }
})

routerCart.delete('/:cid', async (req, res)=>{
    try {
        const cartID = req.params.cid
        await cartsModel.updateOne({_id: cartID}, {products:[]})
        res.status(200).send(`El carrito ${cartID} ha sido limpiado exitosamente`)        
    } catch (error) {
        res.status(400).send(error)
    }
})

export default routerCart