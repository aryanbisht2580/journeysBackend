import express from "express"
import { isAdmin, requireSignin } from "../middleware/authMiddleware.js";
import productController from "../controllers/productController.js";
import formidable from "express-formidable"
const productRouter=express.Router();
const prodC=new productController();
productRouter.post("/createProduct",requireSignin,isAdmin,formidable(),prodC.createProduct);
productRouter.put("/updateProduct/:pid",requireSignin,isAdmin,formidable(),prodC.updateProduct);
productRouter.get("/getAllProducts",prodC.getAllProducts);
productRouter.get("/getProduct/:slug",prodC.getProduct);
productRouter.get("/getPhoto/:pid",prodC.getPhoto);
productRouter.delete("/deleteProduct/:pid",prodC.deleteProduct);
productRouter.get("/getAllBrands",prodC.getAllBrands);
productRouter.post("/getFilterProduct/:page",prodC.getFilterProduct);
productRouter.get("/getproductCount",prodC.getproductCount)
export default productRouter;