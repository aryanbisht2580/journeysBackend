import express from 'express'
import orderController from '../controllers/orderController.js';
import { isAdmin, requireSignin } from '../middleware/authMiddleware.js';
const orderRouter=express.Router();
const orderc=new orderController();
orderRouter.get("/",requireSignin,orderc.getAllOrders)
orderRouter.get("/allOrders",requireSignin,isAdmin,orderc.getAdminOrders)
orderRouter.post("/changeStatus",requireSignin,isAdmin,orderc.changeStatus);
export default orderRouter;