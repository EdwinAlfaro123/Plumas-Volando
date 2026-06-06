import express from "express";
import orderController from "../controller/OrdersController.js";

const router = express.Router();

router.route("/")
  .get(orderController.getOrders)
  .post(orderController.insertOrder);

router.get("/states", orderController.getOrdersByState);
router.get("/recent", orderController.getRecentOrders);

router.route("/:id")
  .put(orderController.updateOrder)
  .delete(orderController.deleteOrder);

export default router;