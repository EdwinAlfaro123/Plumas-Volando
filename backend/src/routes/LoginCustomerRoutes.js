import express from "express"
import loginCustomerController from "../controller/LoginCustomerController.js"

const router = express.Router()

router.route("/").post(loginCustomerController.login)

export default router;