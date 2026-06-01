import express from "express"
import employeeController from "../controller/EmployeesController.js";

const router = express.Router();

router.route("/")
    .get(employeeController.getEmployees)

router.route("/:id")
    .put(employeeController.updateEmployees)
    .delete(employeeController.deleteEmployee)

export default router;