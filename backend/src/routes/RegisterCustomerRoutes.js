import express from "express"
import registerCustomerController from "../controller/RegisterCustomerController.js"

const router = express.Router()

router.route("/")
.post(registerCustomerController.register)


export default router;