import userModel from "../models/userModel.js";
import validateBody from "../helper/bodyCheck.js"
import JWT from "jsonwebtoken"
import { compareHash, hashPassword } from "../helper/bcrypt.js";
import { createTransport } from "nodemailer";


export default class userController{
   register=async(req,res)=>{
     try{
        const {name,email,password,phone,address,role}=req.body;
        const error=validateBody(req.body);
        if(error){
            return res.send({
                success:false,
                message:error.error
            });
        }
        //check for valid body
        const user=await userModel.findOne({
            email
        })
        //check for existing user
        if(user){
            return res.status(200).send({success:false,message:"email already exist!!!"});
        }
        //register
        const hashedPassword=await hashPassword(password);
        const newuser=new userModel({name,email,password:hashedPassword,phone});
        newuser.save();
        res.status(200).send({
            success:true,
            message:"user register successfully!!!"
        })


     }
     catch(err){
        console.log(err);
        res.status(404).send({
            in:"registration",
            error:err
        })
     }
    }

    async login(req,res){
        try{
            const{email,password}=req.body;
            if(!email || !password){
                return res.status(404).send({
                    success:false,
                    message:"email and password required"
                })
            }
            const gotUser=await userModel.findOne({email});
            if(!gotUser){
                return res.status(404).send({
                    success:false,
                    message:"Email do not exist"
                })
            }
            const match=await compareHash(password,gotUser.password);
            if(!match){
                return res.status(404).send({
                    success:false,
                    message:"incorrect password!!!"
                })
            }
            const token=await JWT.sign({_id:gotUser._id},process.env.JWT_SECRET,{
                expiresIn:"7d"
            });
            res.status(200).send({
                success:true,
                message:"login successfull",
                user:gotUser,
                token
            })
            
        }
        catch(err){
            console.log(err);
            return res.status(404).send({
                status:false,
                message:"error in dick"
            })
        }
    }
    getForgetPassword=async(req,res)=>{
        const {email}=req.body;
        
        if(!email){
            res.status(404).send({
                success:false,
                message:"Email Required"
            })
        }
        const user=await userModel.findOne({email});
        if(!user){
            return res.status(404).send({
                success:false,
                message:"Email do not exist"
            })
        }
        const code=Math.floor(Math.random()*(999999-100000))+100000;
        const hashedCode=await hashPassword(""+code);
        const transporter=createTransport({
            service:"gmail",
            auth:{
                user:"driveescape2580@gmail.com",
                pass:"niuz zpbr hytk azdy"
            }
        });
        const mailoptions={
            from:'driveescape@gmail.com',
            to:email,
            subject:"Password Reset",
            text:`Your code to change the password is ${code}`
        }
        try{
            const result=await transporter.sendMail(mailoptions);
            return res.send({
                success:true,
                message:`OTP send to ${email}`,
                user,
                code:hashedCode
            })
        }
        catch(err){
            console.log(err);
            return res.send({
                success:false,
                message:"Failed to reset password"
            })
        }
    }
    setForgetPassword=async(req,res)=>{
        try{
            const {userCode,newPassword,user,code}=req.body;
            console.log(code);
            if(!userCode || !newPassword){
                return res.status(404).send({
                    success:false,
                    message:"OTP and Password Required"
                })
            }
            const out=await compareHash(userCode,code)
            console.log(out)
            if(!out){
                return res.status(404).send({
                    success:false,
                    message:"Incorrect OTP"
                })
            }
            const hashedPassword=await hashPassword(newPassword);
            await userModel.findByIdAndUpdate(user._id,{password:hashedPassword});
            res.status(200).send({
                success:true,
                message:"Password Updated Successfully"
            })
        }catch(err){
            console.log(err);
        }
    }

    updateUser=async (req,res)=>{
        try{
            const userId=req.user._id;
            const {name,email,phone}=req.body;
            const user=await userModel.findById(userId);
            if(!user){
                return res.send({
                    success:false,
                    message:"user not found"
                })
            }
            const updatedUser=await userModel.findByIdAndUpdate(userId,{name,email,phone},{new:true})
            res.status(200).send({
                success:true,
                user:updatedUser,
                message:"user profile update successfully!!!"
            })
            
        }
        catch(err){
            console.log(err);
            return res.send({
                success:false,
                message:"Failed to reset password"
            })
        }
    }

}