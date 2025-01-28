import mongoose, {Schema} from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"
const productsCollection = 'products'

const productsSchema= new Schema({
    title: String,
    description: String,
    code:{
        type: String,
        unique: true
    },
    price:Number,
    status:Boolean,
    stock:Number,
    category:{
        type: String,
        index: true
    }
})
productsSchema.plugin(mongoosePaginate)
export const productsModel = mongoose.model(productsCollection, productsSchema)