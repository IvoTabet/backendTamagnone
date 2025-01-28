import { Router } from "express";
import fs from 'fs'
import { productsModel } from "../models/products.model.js"
import { cartsModel } from "../models/carts.model.js";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { title } from "process";

const routerViews = Router()
let products = []
let cartID = undefined
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

const viewsRouter = (ioServer) =>{

    routerViews.get('/', async (req, res) => {
        try {
            //await fetchData();
            const {limit, page} = req.query
            const result = await productsModel.paginate({},{limit: limit || 10, page: page || 1})
            const inheritedProd = result.docs.map(elem => ({
                title: elem.title,
                price: elem.price,
                description: elem.description,
                code: elem.code,
                status: elem.status,
                stock: elem.stock,
                category: elem.category,
                id: elem._id
            }))

            ioServer.on('connection', socket=>{
                socket.on('getCartID', data=>{
                    cartID = data
                    console.log('id recibido desde el server', cartID);
                })
            })
            
            console.log(cartID)            
            res.render('home', { 
                inheritedProd, 
                pageTitle: 'home', 
                totalPages: result.totalPages, 
                currentPage: result.page,
                cartID: cartID
            });
        } catch (error) {
            console.log(error);
            
            res.status(500).send('error');
        }
    });

    routerViews.get('/realtimeproducts', async (req, res)=>{
        products = await productsModel.find()
        const inheritedProd = products.map(elem => ({
            title: elem.title,
            price: elem.price,
            description: elem.description,
            code: elem.code,
            status: elem.status,
            stock: elem.stock,
            category: elem.category
        }))
        res.render('realTimeProducts', {inheritedProd, pageTitle: 'Lista de Prods'})
    })

    routerViews.get('/carts/:cid', async (req, res) => {
        const IDCart = req.params.cid;
        console.log('IDCart recibido:', IDCart);

        try {
            const thisCart = await cartsModel.findById(IDCart).populate('products.producto');
            const inheritedCart = thisCart.products.map(elem =>({
                title: elem.producto.title, 
                price: elem.producto.price,
                quantity: elem.cantidad
            }))
            if (!thisCart) {
                return res.status(404).send('Carrito no encontrado');
            }
            console.log(inheritedCart);
            
            res.render('carts', { prods: inheritedCart, pageTitle: 'Carrito' });
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            res.status(500).send('Error al obtener el carrito');
        }
    });

    return routerViews
}

export default viewsRouter