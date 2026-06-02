import express from "express"
import eggController from "../controller/EggsController.js";

const router = express.Router();

router.route("/")
    .get(eggController.getEggs)
    .post(eggController.insertEggs)

router.route("/:id")
    .put(eggController.updateEggs)
    .delete(eggController.deleteEggs)

export default router;