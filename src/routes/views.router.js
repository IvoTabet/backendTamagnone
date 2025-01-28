import { Router } from "express";
import fs from 'fs'
import { productsModel } from "../models/products.model.js"
import Handlebars from "handlebars";

const routerViews = Router()
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

const viewsRouter = (ioServer) =>{

    routerViews.get('/', async (req, res) => {
        try {
            //await fetchData();
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
            res.render('home', { inheritedProd, pageTitle: 'home' });
        } catch (error) {
            res.status(500).send(error);
        }
    });

    routerViews.get('/realtimeproducts', async (req, res)=>{
        //await fetchData();
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

    return routerViews
}

export default viewsRouter