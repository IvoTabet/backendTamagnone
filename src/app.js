import express from 'express'
import http from 'http'
import path from 'path'
import productsRouter from './routes/products.router.js'
import routerCart from './routes/cart.router.js'
import handlebars from 'express-handlebars'
import __dirname from '../utils.js'
import routerViews from './routes/views.router.js'
import { Server } from 'socket.io'


const app = express()
const port = 8080
/*const server = http.createServer(app)
const io = new Server(server)*/

const HTTPServer = app.listen(port, ()=>{
    console.log(`server on port ${port}`)
})

const ioServer = new Server(HTTPServer)

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.engine('hbs', handlebars.engine({extname: '.hbs'}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'src', 'views'))
app.use(express.static(__dirname + '/public'))

app.use('/', routerViews)
app.use('/api/products', productsRouter(ioServer))
app.use('/api/carts', routerCart)



ioServer.on('connection', socket =>{
    
    console.log('new user connected with id:', socket.id);
    
    ioServer.emit('message_all', 'Al fin wacho, bienvenido')
})