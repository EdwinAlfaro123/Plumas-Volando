import express from "express";
import chickenController from "../controller/ChickensController.js";
import { validateAuthCookie } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(validateAuthCookie(["employee"]), chickenController.getChickens)
  .post(validateAuthCookie(["employee"]), chickenController.insertChickens);

router
  .route("/:id")
  .put(validateAuthCookie(["employee"]), chickenController.updateChickens)
  .delete(validateAuthCookie(["employee"]), chickenController.deleteChickens);

export default router;