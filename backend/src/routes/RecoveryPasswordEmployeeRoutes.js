import express from "express"

import recoverPasswordEmployeeController from "../controller/RecoveryPasswordEmployeeController.js"

const router = express.Router();

router.route("/requestCode").post(recoverPasswordEmployeeController.requestCode)
router.route("/verifyCode").post(recoverPasswordEmployeeController.verifyCode)
router.route("/newPassword").post(recoverPasswordEmployeeController.newPassword)

export default router;