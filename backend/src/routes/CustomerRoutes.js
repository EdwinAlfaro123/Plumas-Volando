import express from "express"
import customerController from "../controller/CustomerController.js";

const router = express.Router();

router.route("/")
    .get(customerController.getCustomers)

router.route("/:id")
    .put(customerController.updateCustomers)
    .delete(customerController.deleteCustomer)

export default router;