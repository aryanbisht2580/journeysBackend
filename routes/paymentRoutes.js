import express from 'express'
import { requireSignin } from '../middleware/authMiddleware.js';
import paymentController from '../controllers/paymentController.js';
const paymentRouter=express.Router();
const paymentc=new paymentController();
// paymentRouter.post("/",requireSignin,paymentc.createPaymentLink);
paymentRouter.post("/",requireSignin,paymentc.createOrder);
// paymentRouter.get("/update/:orderId",requireSignin,paymentc.updatePaymentInfo);
paymentRouter.post("/verify/:orderId",requireSignin,paymentc.verifyOrder);
export default paymentRouter;