import express from "express"
import cartController from "../controllers/cartController.js";
import { requireSignin } from "../middleware/authMiddleware.js";
const cartRouter=express.Router();
const cartc=new cartController();

cartRouter.get("/",requireSignin,cartc.getCart);
cartRouter.post("/add",requireSignin,cartc.addToCart);
cartRouter.post("/remove",requireSignin,cartc.removeCart);
cartRouter.post("/updateQuantity",requireSignin,cartc.updateQuantity);
cartRouter.post("/getNumber",cartc.getNumber);
cartRouter.get("/deleteAll",requireSignin,cartc.deleteAll);


export default cartRouter;