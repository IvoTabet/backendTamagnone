import mongoose, {Schema} from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"
const cartsCollection = 'carts'

const cartsSchema= new Schema({
    fecha: String,
    monto: Number,
    
    products: {
        type:[{
            producto: {
                type: Schema.Types.ObjectId,
                ref:'products'
            },
            cantidad: Number
        }],
        default: []
    }
})
cartsSchema.plugin(mongoosePaginate)
export const cartsModel = mongoose.model(cartsCollection, cartsSchema)