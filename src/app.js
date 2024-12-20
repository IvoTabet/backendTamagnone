import express from 'express'
import routerProds from './routes/products.router.js'
import routerCart from './routes/cart.router.js'



const app = express()
const port = 8080

app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.get('/', (req, res)=>{
    res.send("Bienvenido a mi app, los items son bicicletas, si no te gustan las bicis, tenemos un problema.")
})

app.use('/api/products', routerProds)
app.use('/api/cart', routerCart)

//app listen
app.listen(port, ()=>{
    console.log(`server on port ${port}`)
})