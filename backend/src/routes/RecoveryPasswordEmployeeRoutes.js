import express from "express"
import recoverPasswordEmployeeController from "../controller/RecoveryPasswordEmployeeController"


//Autenticacion
router.route("/requestCode").post(recoverPasswordEmployeeController.requestCode)
router.route("/verifyCode").post(recoverPasswordEmployeeController.verifyCode)
router.route("/newPassword").post(recoverPasswordEmployeeController.newPassword)

export default router;