import { Schema, model } from "mongoose"

const CustomersSchema = new Schema({
    name: {type: String},
    lastname: {type: String},
    birthdate: {type: Date},
    phone: {type: String},
    email: {type: String},
    password: {type: String},
    DUI: {type: String},
    isActive: {type: Boolean},
    loginAttemps: {type: Number},
    timeOut: {type: Date}
},{
    timestamps: true,
    strict: false
})

export default model("Customers", CustomersSchema, "Customers")