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
    customerEmail: {type: String},
    customerName: {type: String},
    paymentMethod: {type: String, enum: ["card", "cash", "No especificado"], default: "No especificado"},
    state: {type: String, enum: ["Pendiente", "Entregado", "Cancelado"], default: "Pendiente"},
    status: {type: String, enum: ["pending", "completed", "cancelled"], default: "pending"},
    orderDate: {type: Date, default: Date.now}
},{
    timestamps: true,
    strict: false
})

export default model("Orders", OrdersSchema, "Orders")