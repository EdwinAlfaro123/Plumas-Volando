import express from "express";
import customerController from "../controller/CustomerController.js";
import { validateAuthCookie } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(validateAuthCookie(["employee", "customer"]), customerController.getCustomers);

router
  .route("/:id")
  .put(validateAuthCookie(["employee", "customer"]), customerController.updateCustomers)
  .delete(validateAuthCookie(["employee"]), customerController.deleteCustomer);

export default router;