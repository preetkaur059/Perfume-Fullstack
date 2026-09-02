import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    productName : {
        type: String,
        required: true,
        trim: true
    }, 
    price: {
        type: Number,
        required: true
    },
    image: {
      type: String,
      default: "",
    },

    category: {
        type: String,
        required: true
    },

    rating: {
        type: Number,
        default: 0
    },
    description: {
      type: String,
      trim: true
    },
}) 
const product = mongoose.model('products', productSchema)

export default product