import express from "express"
import customerController from "../controller/RegisterCustomerController.js";

const router = express.Router();

router.route("/").post(customerController.insertCustomers)

export default router;