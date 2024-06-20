import cartModel from "../models/cartModel.js";

export default class cartController{
    addToCart=async(req,res)=>{
        try{
            const userId=req.user._id;
            
            const {product,size,quantity}=req.body;
            const newAdd=new cartModel({product,user:userId,size,quantity});    
            await newAdd.save();
            res.status(200).send({success:true,newAdd});
        }
        catch(err){
            console.log(err);
        }
    }
    removeCart=async(req,res)=>{
        try{
            const {cartId}=req.body;
            if(cartId){
                await cartModel.findByIdAndDelete(cartId)
                return res.status(200).send({success:true,message:"deleted successfully"});
            }
            const userId=req.user._id;
            const {product,size}=req.body;
            console.log(userId+" "+product+" "+size)
            await cartModel.deleteOne({user:userId,product,size})

            return res.status(200).send({success:true,message:"deleted successfully"});



        }
        catch(err){
            console.log(err);
        }
    }
    getCart=async(req,res)=>{
        try{
            const userId=req.user._id;
            const cart=await cartModel.find({user:userId}).populate("product","-image");
            
            res.status(200).send({success:true,cart});
        }
        catch(err){
            console.log(err);
        }
    }
    updateQuantity=async(req,res)=>{
        try{
            // const userId=req.user._id;
            
            const {cartId,newQuantity}=req.body;
            const cart=await cartModel.findByIdAndUpdate(cartId,{quantity:newQuantity});
            
            res.status(200).send({success:true,message:"updated successfully"});
        }
        catch(err){
            console.log(err);
        }
    }
    getNumber=async(req,res)=>{
        try{
            const {userId}=req.body;
            console.log(userId)
            const count=await cartModel.countDocuments({user:userId})
            
            res.status(200).send({count});
        }
        catch(err){
            console.log(err);
        }
    }
    deleteAll=async(req,res)=>{
        try{
            const userId=req.user._id;
            console.log(userId)
            await cartModel.deleteMany({user:userId})
            
            res.sendStatus(200);
        }
        catch(err){
            console.log(err);
        }
    }
}