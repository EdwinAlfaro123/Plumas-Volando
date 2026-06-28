import express from "express";
import SalesHistoryController from "../controller/SalesHistoryController.js";
import { validateAuthCookie } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(validateAuthCookie(["employee"]), SalesHistoryController.getHistory)
  .post(validateAuthCookie(["employee"]), SalesHistoryController.insertSalesHistory);

router
  .route("/:id")
  .put(validateAuthCookie(["employee"]), SalesHistoryController.updateSalesHistory)
  .delete(validateAuthCookie(["employee"]), SalesHistoryController.deleteSalesHistory);

export default router;