import { Schema, model } from "mongoose"

const EmployeesSchema = new Schema({
    name: {type: String},
    email: {type: String},
    password: {type: String},
    phone: {type: String},
    DateContract: {type: Date},
    Status: {type: String}
},{
    timestamps: true,
    strict: false
})

export default model("Employees", EmployeesSchema, "Employees(listo)")