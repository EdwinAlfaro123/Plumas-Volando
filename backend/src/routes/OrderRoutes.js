import express from "express"
import orderController from "../controller/OrdersController.js"

const router = express.Router()

router.route("/")
.get(orderController.getOrders)
.post(orderController.insertOrder)

router.route("/:id")
.put(orderController.updateOrder)
.delete(orderController.deleteOrder)
router.get("/states", orderController.getOrdersByState)
router.get("/recent", orderController.getRecentOrders)
export default router