import eggsModel from "../model/Eggs.js"

const eggController = {};

//SELECT
eggController.getEggs = async (req, res) => {
    try {
        const eggs = await eggsModel.find();
        return res.status(200).json(eggs)
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
};

//INSERT
eggController.insertEggs = async (req, res) => {
    try{
        const {eggsProduced, totalEggs, date, eggsLosts} = req.body;

        // Validar que no falten datos
        if (!eggsProduced || totalEggs === undefined || !date || eggsLosts === undefined){
            return res.status(400).json({message: "Todos los campos son obligatorios"});
        }

        // Validar estructura de eggsProduced
        const { jumbo, grande, mediano, pequeno } = eggsProduced;

        if (jumbo === undefined || grande === undefined || mediano === undefined || pequeno === undefined){
            return res.status(400).json({message: "Debe ingresar todas las cantidades de huevos"});
        }

        // Validar números
        const numeros = [
            jumbo,
            grande,
            mediano,
            pequeno,
            totalEggs,
            eggsLosts,
        ];
    
        const hayNumeroInvalido = numeros.some(
            (valor) => typeof valor !== "number" || isNaN(valor)
        );
    
        if (hayNumeroInvalido) {
            return res.status(400).json({message: "Todos los campos numéricos deben ser números válidos",});
        }

        // Validar negativos
        const hayNegativos = numeros.some((valor) => valor < 0);

        if (hayNegativos) {
            return res.status(400).json({message: "No se permiten números negativos"});
        }
  
        const newEggs = new eggsModel({eggsProduced, totalEggs, date, eggsLosts});

        await newEggs.save();

        return res.status(200).json({message: "Eggs saved"})
    }catch (error){
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
};

eggController.getMonthlyProduction = async (req, res) => {
    try {
        const year = req.query.year ? Number(req.query.year) : null

        const pipeline = [
            {
                $addFields: {
                    realDate: {
                        $toDate: {
                            $ifNull: [
                                "$date",
                                {
                                    $ifNull: [
                                        "$fecha",
                                        {
                                            $ifNull: ["$createdAt", "$startDate"]
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    quantityValue: {
                        $ifNull: [
                            "$quantityEggs",
                            {
                                $ifNull: [
                                    "$cantidadHuevos",
                                    {
                                        $ifNull: [
                                            "$totalEggs",
                                            {
                                                $ifNull: ["$quantity", 0]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        ]

        if (year) {
            pipeline.push({
                $match: {
                    realDate: {
                        $gte: new Date(`${year}-01-01`),
                        $lt: new Date(`${year + 1}-01-01`)
                    }
                }
            })
        }

        pipeline.push(
            {
                $group: {
                    _id: { $month: "$realDate" },
                    total: { $sum: "$quantityValue" }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            },
            {
                $project: {
                    _id: 0,
                    monthNumber: "$_id",
                    total: 1
                }
            }
        )

        const monthlyData = await eggsModel.aggregate(pipeline)

        const months = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre"
        ]

        const result = months.map((month, index) => {
            const found = monthlyData.find(
                item => item.monthNumber === index + 1
            )

            return {
                month,
                shortMonth: month.slice(0, 3),
                monthNumber: index + 1,
                total: found ? found.total : 0
            }
        })

        return res.status(200).json(result)
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}



//UPDATE
eggController.updateEggs = async (req, res) => {
    try{
        let {
            eggsProduced, 
            totalEggs, 
            date, 
            eggsLosts
        } = req.body;

        // Validar que no falten datos
        if (!eggsProduced || totalEggs === undefined || !date || eggsLosts === undefined){
            return res.status(400).json({message: "Todos los campos son obligatorios"});
        }

        // Validar estructura de eggsProduced
        const { jumbo, grande, mediano, pequeno } = eggsProduced;

        if (jumbo === undefined || grande === undefined || mediano === undefined || pequeno === undefined){
            return res.status(400).json({message: "Debe ingresar todas las cantidades de huevos"});
        }

        // Validar números
        const numeros = [
            jumbo,
            grande,
            mediano,
            pequeno,
            totalEggs,
            eggsLosts,
        ];
    
        const hayNumeroInvalido = numeros.some(
            (valor) => typeof valor !== "number" || isNaN(valor)
        );
    
        if (hayNumeroInvalido) {
            return res.status(400).json({message: "Todos los campos numéricos deben ser números válidos",});
        }

        // Validar negativos
        const hayNegativos = numeros.some((valor) => valor < 0);

        if (hayNegativos) {
            return res.status(400).json({message: "No se permiten números negativos"});
        }

        const eggsUpdated = await eggsModel.findByIdAndUpdate(
            req.params.id,
            {
                eggsProduced, 
                totalEggs, 
                date, 
                eggsLosts
            },
            { new: true }
        );

        if (!eggsUpdated) {
            return res.status(404).json({message: "Eggs not found"});
        }
      
        return res.status(200).json({message: "Eggs updated"});
    } catch (error){
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
};

//ELIMINAR
eggController.deleteEggs = async (req, res) => {
    try {
        const deletedEggs = await eggsModel.findByIdAndDelete(req.params.id);

        if(!deletedEggs){
            return res.status(404).json({message: "Eggs not found"})
        }

        return res.status(200).json({message: "Eggs deleted"})
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
};

export default eggController;