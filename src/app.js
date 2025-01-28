import express from 'express'
import http from 'http'
import path from 'path'
import productsRouter from './routes/products.router.js'
import routerCart from './routes/cart.router.js'
import handlebars from 'express-handlebars'
import __dirname from '../utils.js'
import routerViews from './routes/views.router.js'
import { Server } from 'socket.io'
import { PRD } from './managers/manager.js'
import connectionMongo from './connection/mongo.js'
import exphbs from 'express-handlebars'


const app = express()
const port = 8080

connectionMongo()
const HTTPServer = app.listen(port, ()=>{
    console.log(`server on port ${port}`)
})

const ioServer = new Server(HTTPServer)

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const hbs = exphbs.create({
    extname: '.hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'src', 'views'))
app.use(express.static(__dirname + '/public'))

app.use('/', routerViews(ioServer))
app.use('/api/products', productsRouter(ioServer))
app.use('/api/carts', routerCart)

// Registrar helpers
hbs.handlebars.registerHelper('gt', function(a, b) {
    return a > b;
});

hbs.handlebars.registerHelper('lt', function(a, b) {
    return a < b;
});

hbs.handlebars.registerHelper('dec', function(value) {
    return value - 1;
});

hbs.handlebars.registerHelper('inc', function(value) {
    return value + 1;
});

ioServer.on('connection', socket =>{
    
    console.log('new user connected with id:', socket.id);
    socket.on('prodCreatedFromForm', async (createdProd)=>{
        await PRD.addProd(createdProd)
        ioServer.emit('prodCreated', await PRD.getAllProds())
    })
    ioServer.emit('message_all', 'Al fin wacho, bienvenido')
})