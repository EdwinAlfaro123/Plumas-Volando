import { Schema, model } from "mongoose"

const EggsSchema = new Schema({
    eggsProduced: [
        {
            jumbo: {type: Number},
            grande: {type: Number},
            mediano: {type: Number},
            pequeno: {type: Number}
        }
    ],
    totalEggs: {Number},
    date: {type: Date},
    lostEggs: {type: Number},
    date: {type: Date}
},{
    timestamps: true,
    strict: false
})

export default model("Eggs", EggsSchema, "Eggs(listo)")