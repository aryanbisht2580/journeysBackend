 import express from "express";
 import userController from "../controllers/userController.js";
import  { requireSignin,isAdmin } from "../middleware/authMiddleware.js";
 const userRouter=express.Router();
 const userc=new userController();

//Register
userRouter.post("/register",userc.register);
userRouter.post("/login",userc.login);
userRouter.get("/dashboard",requireSignin,(req,res)=>{
    res.send(
        {success:true,message:"user dashboard"}
    )
})
userRouter.post("/adminDashboard",requireSignin,isAdmin,(req,res)=>{
    res.send(
        {success:true,message:"user dashboard"}
    )
})
userRouter.post("/getForgetPassword",userc.getForgetPassword);
userRouter.post("/setForgetPassword",userc.setForgetPassword);
userRouter.post("/updateUserProfile",requireSignin,userc.updateUser);

export default userRouter;