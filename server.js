import express from "express";
import dotenv from "dotenv"
import connectToDB from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import cors from "cors";
import categoryRouter from "./routes/categoryRoute.js";
import productRouter from "./routes/productRoute.js";
import paymentRouter from "./routes/paymentRoutes.js";
import orderRouter from "./routes/orderRoute.js";
import cartRouter from "./routes/cartRoute.js";

dotenv.config();
const app=express();
app.use(cors())
app.use(express.json());
app.use('/api/auth/',userRouter);
app.use('/api/category',categoryRouter)
app.use('/api/product',productRouter)
app.use("/api/payment",paymentRouter)
app.use("/api/orders",orderRouter)
app.use("/api/cart",cartRouter)
app.get('/',(req,res)=>{
    res.send("welcome to ecommerce website")
})


const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log("sever running at",PORT);
    connectToDB();
})