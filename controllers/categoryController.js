import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";
export default class categoryController{
    createCategory=async(req,res)=>{
        try{
            const {name}=req.body;
            if(!name){
                return res.status(401).send({
                    success:false,
                    message:"Name requried"
                })
            }
            const existing=await categoryModel.findOne({name});
            if(existing){
                return res.status(401).send({
                    success:false,
                    message:"Category already Exist!!!"
                })
            }
            const newCat= new categoryModel({name,slug:slugify(name)});
            await newCat.save();
            return res.status(201).send({
                success:true,
                message:"Category created successfull!!!"
            })
        }catch(err){
            return res.status(500).send({
                success:false,
                message:"error in category"
            })
        }
    }
    updateCategory=async(req,res)=>{
        try{
            const {id}=req.params;
            const {name}=req.body;
            const category=await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})
            res.status(200).send({
                success:true,
                message:"Category Updated!!!"
            })
        }catch(err){
            res.staus(500).send({
                success:false,
                message:"Error while updating category!!!"
            })
        }
    }
    getCategories=async(req,res)=>{
        try{
            const categories=await categoryModel.find();
            
            res.status(200).send({
                success:true,
                message:"Categories fetched successfully",
                categories
            })
        }catch(err){
            res.status(500).send({
                success:false,
                message:"Error while fetching categories!!!"
            })
        }
    }
    getCategory=async(req,res)=>{
        try{
            const {slug}=req.params;
            const category=await categoryModel.findOne({slug});
            res.status(200).send({
                success:true,
                message:"Category fetched successfully",
                category
            })
        }catch(err){
            res.status(500).send({
                success:false,
                message:"Error while fetching category!!!"
            })
        }
    }
    deleteCategory=async(req,res)=>{
        try{
            const {id}=req.params;
            await categoryModel.findByIdAndDelete(id);
            res.status(200).send({
                success:true,
                message:"Category deleted successfully",
            })
        }catch(err){
            res.status(500).send({
                success:false,
                message:"Error while deleting category!!!"
            })
        }
    }
}