import { Schema, model } from "mongoose"

const AdminSchema = new Schema({
    name: {type: String},
    email: {type: String},
    phone: {type: String},
    password: {type: String},
    ConfirmPassword: {type: String},
    isActive: {type: Boolean},
    isVerified: {type: Boolean},
    loginAttemps: {type: Number},
    timeOut: {type: Date}
},{
    timestamps: true,
    strict: false
})

export default model("Admin", AdminSchema, "Admin")