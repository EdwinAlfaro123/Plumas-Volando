import { Schema, model } from "mongoose"

const ChickensSchema = new Schema({
    quantityChickens: {type: Number},
    chickensLosts: {type: Number},
    weeksLife: {type: Number},
    quantitySick: {type: Number},
    startDate: {type: Date},
    endDate: {type: Date}
},{
    timestamps: true,
    strict: false
})

export default model("Chickens", ChickensSchema, "Chickens")