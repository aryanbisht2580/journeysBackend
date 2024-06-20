import express from "express"
import categoryController from "../controllers/categoryController.js";
import { isAdmin, requireSignin } from "../middleware/authMiddleware.js";
const categoryRouter=express.Router();
const categoryC=new categoryController();

categoryRouter.post("/createCategory",requireSignin,isAdmin,categoryC.createCategory);
categoryRouter.put("/updateCategory/:id",requireSignin,isAdmin,categoryC.updateCategory)
categoryRouter.get("/getCategories",categoryC.getCategories)
categoryRouter.get("/getCategory/:slug",categoryC.getCategory)
categoryRouter.delete("/deleteCategory/:id",requireSignin,isAdmin,categoryC.deleteCategory)
export default categoryRouter;