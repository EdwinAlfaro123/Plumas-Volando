import productsModel from "../model/Products.js"
import ordersModel from "../model/Orders.js"
import {v2 as cloudinary} from "cloudinary"

const productsController = {}

productsController.getAllProducts = async (req, res) => {
    try {
        const products = await productsModel.find()
        return res.status(200).json(products)
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

productsController.insertProduct = async (req, res) => {
    try {
        const {name, TypeProduct, description, unitPrice, quantity, review} = req.body

        const newProduct = new productsModel({
            name,
            TypeProduct,
            description,
            unitPrice,
            quantity,
            review,
            image: req.file.path,
            public_id: req.file.filename
        })

        await newProduct.save()

        return res.status(200).json({message: "Product saved"})
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

productsController.updateProduct = async (req, res) => {
    try {
        const {name, TypeProduct, description, unitPrice, quantity, review} = req.body

        const productFound = await productsModel.findById(req.params.id)

        const updatedData = {
            name,
            TypeProduct,
            description,
            unitPrice,
            quantity,
            review
        }

        if(req.file){
            await cloudinary.uploader.destroy(productFound.public_id)

            updatedData.image = req.file.path
            updatedData.public_id = req.file.filename
        }

        await productsModel.findByIdAndUpdate(
            req.params.id,
            updatedData,
            {new: true}
        )

        return res.status(200).json({message: "Product updated"})
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}


productsController.deleteProduct = async (req, res) =>{
    try {
        const productFound = await productsModel.findById(req.params.id)
        
        await cloudinary.uploader.destroy(productFound.public_id)
        
        await productsModel.findByIdAndDelete(req.params.id)

        return res.status(200).json({message: "Product deleted"})
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

productsController.getTopSellingProducts = async (req, res) => {
    try {
        const topProducts = await ordersModel.aggregate([
            {
                $match: {
                    state: "Entregado"
                }
            },
            {
                $unwind: "$products"
            },
            {
                $group: {
                    _id: {
                        idProduct: "$products.idProduct",
                        name: "$products.name"
                    },
                    quantitySold: {
                        $sum: "$products.quantity"
                    },
                    totalSold: {
                        $sum: {
                            $multiply: [
                                "$products.quantity",
                                {
                                    $ifNull: ["$products.price", 0]
                                }
                            ]
                        }
                    }
                }
            },
            {
                $sort: {
                    quantitySold: -1
                }
            },
            {
                $limit: 5
            },
            {
                $project: {
                    _id: 0,
                    idProduct: "$_id.idProduct",
                    name: "$_id.name",
                    quantitySold: 1,
                    totalSold: 1
                }
            }
        ])

        return res.status(200).json(topProducts)
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export default productsController;