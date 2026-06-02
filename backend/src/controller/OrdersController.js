import ordersModel from "../model/Orders.js"
import productsModel from "../model/Products.js"
import "../model/Customer.js";

const orderController = {}

orderController.getOrders = async (req, res) => {
    try {
        const orders = await ordersModel.find()
        return res.status(200).json(orders)
    } catch (error) {
        console.log("error " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

orderController.insertOrder = async (req, res) => {
    try {
        const { products, location, date, customerId } = req.body;

        let total = 0;
        const newProducts = [];

        for (let i = 0; i < products.length; i++) {

            const ProductoFound = await productsModel.findById(products[i].productId);

            if (!ProductoFound) {
                return res.status(404).json({
                    message: `Producto no encontrado: ${products[i].productId}`
                });
            }

            const quantity = Number(products[i].quantity);
            const price = Number(ProductoFound.unitPrice ?? ProductoFound.UnitPrice);

            const subtotal = price * quantity;

            total += subtotal;

            newProducts.push({
                productId: products[i].productId,
                quantity,
                subtotal
            });
        }

        const newOrder = new ordersModel({
            products: newProducts,
            location,
            date,
            totalPrice: total,
            customerId
        });

        await newOrder.save();

        return res.status(200).json({
            message: "Orden insertada correctamente"
        });

    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

orderController.updateOrder = async (req, res) => {
    try {
        const { products, location, date, customerId } = req.body;

        let total = 0

        let newProducts = []

        for (let i = 0; i < products.length; i++) {

            const ProductoFound = await productsModel.findById(products[i].productId);

            const quantity = Number(products[i].quantity);
            const price = Number(ProductoFound.unitPrice ?? ProductoFound.UnitPrice);

            const subtotal = price * quantity;

            total += subtotal;

            newProducts.push({
                productId: products[i].productId,
                quantity,
                subtotal
            });
        }

        const updatedOrder = await ordersModel.findByIdAndUpdate(req.params.id,
            {
                products: newProducts,
                location,
                date,
                totalPrice: total,
                customerId
            },
            {
                new: true
            }
        )
        return res.status(200).json({message: "Se actualizo la orden correctamente"})
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

orderController.deleteOrder = async (req, res) => {
    try {
        await ordersModel.findByIdAndDelete(req.params.id)
        return res.status(200).json({message: "Se elimino la orden correctamente"})
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export default orderController