import express from "express"
import productController from "../controller/ProductsController.js"
import upload from "../utils/cloudinaryConfig.js"

const router = express.Router()

router.route("/")
.get(productController.getAllProducts)
.post(upload.single("image"), productController.insertProduct)

router.route("/:id")
.put(upload.single("image"), productController.updateProduct)
.delete(productController.deleteProduct)
router.get("/top-selling", productController.getTopSellingProducts)

export default router