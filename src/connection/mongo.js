import mongoose from "mongoose";

const uri = 'mongodb+srv://ivotabet:tEc7O5R8vLTn7BIX@backendtamagnone.huzmv.mongodb.net/?retryWrites=true&w=majority&appName=BackEndTamagnone'

const connectionMongo = async()=>{
    
    try {
        await mongoose.connect(uri, {
            dbName: 'BicicletasDB'
        })
        console.log('conectado a DB');
        
    } catch {
        console.log('error al conectarse a la Base de Datos');
    }    
}

export default connectionMongo