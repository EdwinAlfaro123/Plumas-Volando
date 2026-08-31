import express from "express";
import productController from "../controller/ProductsController.js";
import upload from "../utils/cloudinaryConfig.js";
import { validateAuthCookie } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/top-selling",
  validateAuthCookie(["employee", "customer"]),
  productController.getTopSellingProducts
);

router
  .route("/")
  .get(validateAuthCookie(["employee", "customer"]), productController.getAllProducts)
  .post(
    validateAuthCookie(["employee"]),
    upload.single("image"),
    productController.insertProduct
  );

router
  .route("/:id")
  .put(
    validateAuthCookie(["employee"]),
    upload.single("image"),
    productController.updateProduct
  )
  .delete(validateAuthCookie(["employee"]), productController.deleteProduct);

export default router;