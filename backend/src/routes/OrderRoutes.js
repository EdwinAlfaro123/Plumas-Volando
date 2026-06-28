import express from "express";
import orderController from "../controller/OrdersController.js";
import { validateAuthCookie } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(validateAuthCookie(["employee", "customer"]), orderController.getOrders)
  .post(validateAuthCookie(["employee", "customer"]), orderController.insertOrder);

router.get(
  "/states",
  validateAuthCookie(["employee", "customer"]),
  orderController.getOrdersByState
);

router.get(
  "/recent",
  validateAuthCookie(["employee"]),
  orderController.getRecentOrders
);

router
  .route("/:id")
  .put(validateAuthCookie(["employee", "customer"]), orderController.updateOrder)
  .delete(validateAuthCookie(["employee", "customer"]), orderController.deleteOrder);

export default router;