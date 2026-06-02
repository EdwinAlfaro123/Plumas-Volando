import express from "express"
import chickenController from "../controller/ChickensController.js";

const router = express.Router();

router.route("/")
    .get(chickenController.getChickens)
    .post(chickenController.insertChickens)

router.route("/:id")
    .put(chickenController.updateChickens)
    .delete(chickenController.deleteChickens)

export default router;