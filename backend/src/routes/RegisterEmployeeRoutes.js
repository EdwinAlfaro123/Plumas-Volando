import express from "express";
import registerEmployeeController from "../controller/RegisterEmployeeController.js";
import upload from "../utils/cloudinaryConfig.js"


const router = express.Router();

router.route("/")
  .post(registerEmployeeController.register);

router.route("/verifyCodeEmail")
  .post(registerEmployeeController.verifyCode);

export default router;