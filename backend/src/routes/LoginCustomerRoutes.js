import express from "express"
import LoginCustomerController from "../controller/LoginCustomerController.js"
 
 
const router = express.Router();
 
 
router.route("/").post(LoginCustomerController.login);
 
 
export default router;