import express from "express"

import recoverPasswordCustomerController from "../controller/RecoveryCustomerPasswordController.js"

const router = express.Router();

router.route("/requestCode").post(recoverPasswordCustomerController.requestCode)
router.route("/verifyCode").post(recoverPasswordCustomerController.verifyCode)
router.route("/newPassword").post(recoverPasswordCustomerController.newPassword)

export default router;