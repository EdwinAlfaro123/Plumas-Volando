import express, {Router }  from "express"
import CustomerController from "../controller/CustomerController.js"


const router = express.Router()

router.route("/")
.get(CustomerController.getCustomers)


router.route("/:id")
.put(CustomerController.putCustomer)
.delete(CustomerController.deleteCustomer)


export default router;