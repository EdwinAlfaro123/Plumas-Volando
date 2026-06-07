import mongoose, { Schema, model } from "mongoose"

const BillSchema = new Schema({
    OrderId: {type: mongoose.Types.ObjectId, ref: "Orders"},
    date: {type: Date},
    paymentMethod: {type: String}
},{
    timestamps: true,
    strict: false
})

export default model("Bill", BillSchema, "Bills")