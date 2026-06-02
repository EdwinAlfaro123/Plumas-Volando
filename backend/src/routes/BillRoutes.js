import express from "express"
import billController from "../controller/BillController.js";

const router = express.Router();

router.route("/")
    .get(billController.getBills)
    .post(billController.insertBills)

router.route("/:id")
    .put(billController.updateBills)
    .delete(billController.deleteBills)

export default router;