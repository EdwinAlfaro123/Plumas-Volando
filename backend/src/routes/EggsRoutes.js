import express from "express";
import eggController from "../controller/EggsController.js";
import { validateAuthCookie } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(validateAuthCookie(["employee"]), eggController.getEggs)
  .post(validateAuthCookie(["employee"]), eggController.insertEggs);

router.get(
  "/monthly-production",
  validateAuthCookie(["employee"]),
  eggController.getMonthlyProduction
);

router
  .route("/:id")
  .put(validateAuthCookie(["employee"]), eggController.updateEggs)
  .delete(validateAuthCookie(["employee"]), eggController.deleteEggs);

export default router;