import { Schema, model } from "mongoose"

const ProductsSchema = new Schema({
    name: {type: String},
    TypeProduct: {type: String},
    description: {type: String},
    unitPrice: {type: Number},
    quantity: {type: Number},
    review: {type: Number},
    image: {type: String},
    public_id: {type: String}
},{
    timestamps: true,
    strict: false
})

export default model("Products", ProductsSchema, "Products")