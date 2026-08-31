import express from "express";
import billController from "../controller/BillController.js";
import { validateAuthCookie } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(validateAuthCookie(["employee", "customer"]), billController.getBills)
  .post(validateAuthCookie(["employee"]), billController.insertBills);

router
  .route("/:id")
  .put(validateAuthCookie(["employee"]), billController.updateBills)
  .delete(validateAuthCookie(["employee"]), billController.deleteBills);

export default router;