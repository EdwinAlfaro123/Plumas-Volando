import mongoose, { Schema, model } from "mongoose"

const OrdersSchema = new Schema({
    products: [
        {
            productId: {type: mongoose.Types.ObjectId, ref: "Products"},
            quantity: {type: Number},
            subtotal: {type: Number}
        }
    ],
    location: {type: String},
    date: {type: Date},
    totalPrice: {type: Number},
    customerId: {type: mongoose.Types.ObjectId, ref: "Customers"},
},{
    timestamps: true,
    strict: false
})

export default model("Orders", OrdersSchema, "Orders")