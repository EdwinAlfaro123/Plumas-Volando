import mongoose, { Schema, model, mongoosePopulatedDocumentMarker } from "mongoose"

const SalesHistorySchema = new Schema({
    date: {type: Date},
    employeeId: {type: mongoose.Types.ObjectId, ref: "Order"},
    billId: {type: mongoose.Types.ObjectId, ref: "Bill"},
    paymentMethod: {type: String}
},{
    timestamps: true,
    strict: false
})

export default model("SalesHistory", SalesHistorySchema, "SalesHistory")