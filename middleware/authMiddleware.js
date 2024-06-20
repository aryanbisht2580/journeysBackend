import JWT from "jsonwebtoken"
import userModel from "../models/userModel.js";
export const requireSignin=(req,res,next)=>{
    try{
        const token=req.headers.authorization;
        const decode=JWT.verify(token,process.env.JWT_SECRET)
        req.user=decode;
        next();
    }
    catch(err){
        console.log(err);
    }
}
export const isAdmin=async(req,res,next)=>{
    try{
        const user= await userModel.findById(req.user._id);
        if(user.role!=="ADMIN"){
            return res.send({
                status:false,
                message:"unauthorized access"
            })
        }
        next();

    }catch(err){
        console.log(err);
    }
}