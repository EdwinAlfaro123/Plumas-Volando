import { Schema, model } from "mongoose"

const EggsSchema = new Schema({
    eggsProduced: [
        {
            jumbo: {type: Number},
            grande: {type: Number},
            mediano: {type: Number},
            pequeno: {type: Number},
            _id: false
        }
    ],
    totalEggs: {type: Number},
    date: {type: Date},
    eggsLosts: {type: Number}
},{
    timestamps: true,
    strict: false
})

export default model("Eggs", EggsSchema, "Eggs")