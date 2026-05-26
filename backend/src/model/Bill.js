import mongoose, { Schema, model, mongoosePopulatedDocumentMarker } from "mongoose"

const BillSchema = new Schema({
    OrderId: {type: mongoose.Types.ObjectId, ref: "Order"},
    date: {type: Date},
    paymentMethod: {type: String}
},{
    timestamps: true,
    strict: false
})

export default model("Bill", BillSchema, "Bill")