import { Router } from "express";
import fs from 'fs'

const routerViews = Router()
let products = []
fs.readFile('src/products.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error al leer el archivo:', err);
        return;
    }
    products = JSON.parse(data); 
});

routerViews.get('/', (req, res)=>{
    res.render('home', {products, 
        pageTitle: 'home'})
})

routerViews.get('/realtimeproducts', (req, res)=>{
    res.render('realTimeProducts', {products, pageTitle: 'Lista de Prods'})
})

export default routerViews