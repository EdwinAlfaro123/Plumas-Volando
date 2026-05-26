import { Schema, model } from "mongoose"

const ChickensSchema = new Schema({
    quantity: {type: Number},
    lostChickens: {type: Number},
    weekLife: {type: Number},
    sickChickens: {type: Number},
    StartDate: {type: Date},
    EndDate: {type: Date}
},{
    timestamps: true,
    strict: false
})

export default model("Chickens", ChickensSchema, "Chickens(listo)")