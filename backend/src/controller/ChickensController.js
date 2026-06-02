import chickensModel from "../model/Chickens.js"

const chickenController = {};

//SELECT
chickenController.getChickens = async (req, res) => {
    try {
        const chickens = await chickensModel.find();
        return res.status(200).json(chickens)
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
};

//INSERT
chickenController.insertChickens = async (req, res) => {
    try {
        const {quantityChickens, chickensLosts, weeksLife, quantitySick, startDate, endDate} = req.body;

        // Validar que no falten datos
        if (quantityChickens === undefined || chickensLosts === undefined || !startDate || !endDate || weeksLife === undefined || quantitySick === undefined){
            return res.status(400).json({message: "Todos los campos son obligatorios"});
        }

        // Validar números
        const numeros = [
            quantityChickens,
            weeksLife,
            quantitySick,
            chickensLosts
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

        const newChickens = new chickensModel({quantityChickens, chickensLosts, weeksLife, quantitySick, startDate, endDate})

        await newChickens.save();

        return res.status(200).json({message: "Chickens saved"})
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
};

//UPDATE
chickenController.updateChickens = async (req, res) => {
    try {
        let {
            quantityChickens, 
            chickensLosts,
            weeksLife, 
            quantitySick, 
            startDate, 
            endDate
        } = req.body;

        // Validar que no falten datos
        if (quantityChickens === undefined || chickensLosts === undefined || !startDate || !endDate || weeksLife === undefined || quantitySick === undefined){
            return res.status(400).json({message: "Todos los campos son obligatorios"});
        }

        // Validar números
        const numeros = [
            quantityChickens,
            weeksLife,
            quantitySick,
            chickensLosts
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

        const chickensUpdated = await chickensModel.findByIdAndUpdate(
            req.params.id,
            {
                quantityChickens, 
                chickensLosts,
                weeksLife, 
                quantitySick, 
                startDate, 
                endDate
            },
            { new: true }
        );

        if (!chickensUpdated) {
            return res.status(404).json({message: "Chickens not found"});
        }
      
        return res.status(200).json({message: "Chickens updated"});
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
};

//ELIMINAR
chickenController.deleteChickens = async (req, res) => {
    try {
        const deletedChickens = await chickensModel.findByIdAndDelete(req.params.id);

        if(!deletedChickens){
            return res.status(404).json({message: "Chickens not found"})
        }

        return res.status(200).json({message: "Chickens deleted"})
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
};

export default chickenController;