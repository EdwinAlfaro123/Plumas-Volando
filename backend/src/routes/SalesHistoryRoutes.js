import express from "express"
import SalesHistoryController from "../controller/SalesHistoryController.js";

const router = express.Router()

router.route("/")
.get(SalesHistoryController.getHistory)
.post(SalesHistoryController.insertSalesHistory)

router.route("/:id")
.put(SalesHistoryController.updateSalesHistory)
.delete(SalesHistoryController.deleteSalesHistory)
export default router;