import express from "express";
import employeeController from "../controller/EmployeesController.js";
import { validateAuthCookie } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(validateAuthCookie(["employee"]), employeeController.getEmployees);

router
  .route("/:id")
  .put(validateAuthCookie(["employee"]), employeeController.updateEmployees)
  .delete(validateAuthCookie(["employee"]), employeeController.deleteEmployee);

router.patch("/:id/photo", validateAuthCookie(["employee"]), employeeController.patchEmployeePhoto);

export default router;