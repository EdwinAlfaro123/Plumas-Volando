import express from "express"
import employeeController from "../controller/RegisterEmployeeController.js";

const router = express.Router();

router.route("/").post(employeeController.insertEmployees)

export default router;