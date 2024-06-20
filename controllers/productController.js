import fs from 'fs'
import slugify from 'slugify';
import productModel from '../models/productModel.js';
import mongoose from 'mongoose';
export default class productController {
    createProduct = async (req, res) => {
        try {
            const { name, price, sizes, color, category, quantity, description, brand } = req.fields;
            const { image } = req.files
            switch (true) {
                case !name:
                    return res.status(500).send({ success: false, message: "name is required!!!" });
                case !price:
                    return res.status(500).send({ success: false, message: "price is required!!!" });
                case !sizes:
                    return res.status(500).send({ success: false, message: "sizes is required!!!" });
                case !color:
                    return res.status(500).send({ success: false, message: "color is required!!!" });
                case !brand:
                    return res.status(500).send({ success: false, message: "brand is required!!!" });
                case !category:
                    return res.status(500).send({ success: false, message: "category is required!!!" });
                case !quantity:
                    return res.status(500).send({ success: false, message: "quantity is required!!!" });
                case !description:
                    return res.status(500).send({ success: false, message: "description is required!!!" });
                case !image && image.size > 1000000:
                    return res.status(500).send({ success: false, message: "image is required and should be less then 1 mb" });
            }
            const parsedSizes = JSON.parse(sizes);
            const p = await productModel.findOne({ name }).select("-image");
            if (p) {
                return res.status(500).send({
                    success: false,
                    message: "Product Already Exist!!!"
                })
            }
            const product = new productModel({ ...req.fields, slug: slugify(req.fields.name), sizes: parsedSizes });
            if (image) {
                product.image.data = fs.readFileSync(image.path);
                product.image.contentType = image.type;
            }
            await product.save();
            res.status(200).send({ success: true, message: "new product create successsfully!!!", product });

        }
        catch (err) {
            return res.status(400).send({
                success: false,
                message: "Error while creating Product!!!",
                err
            })
        }
    }
    getAllProducts = async (req, res) => {
        try {
            const products = await productModel.find().populate('category').select("-image").limit(20).sort({ createAt: -1 });
            return res.status(200).send({
                success: true,
                message: "Products fetched successfully",
                products
            })
        } catch (err) {
            console.log(err)
            return res.status(400).send({
                success: false,
                message: "Error while fetching Products!!!",
                err
            })
        }
    }
    getProduct = async (req, res) => {
        
        try {
            const { slug } = req.params;
            const product = await productModel.findOne({ slug }).select("-image").populate('category');
            return res.status(200).send({
                success: true,
                message: "Product fetched successfully",
                product
            })
        } catch (err) {
            console.log(err)
            return res.status(400).send({
                success: false,
                message: "Error while fetching Products!!!",
            })
        }
    }
    getPhoto = async (req, res) => {
        try {
            const { pid } = req.params;
            if(!pid || pid==="undefined"){
                return res.send("failed")
            }
            const product = await productModel.findById(pid).select("image");
            if (!product) {
                return res.status(500).send({
                    success: false,
                    message: "Cannot find the product!!!"
                })
            }
            res.set("Content-Type", product.image.contentType)
            return res.status(200).send(product.image.data)
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                success: false,
                message: "Error while fetching Photo!!!",
            })
        }
    }
    deleteProduct = async (req, res) => {
        try {
            const { pid } = req.params;
            await productModel.findByIdAndDelete(pid).select("-photo");
            return res.status(200).send({
                success: true,
                message: "Product Deleted Successfully!!!",
            })
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                success: false,
                message: "Error while Deleting Photo!!!",
            })
        }
    }
    updateProduct = async (req, res) => {
        try {
            const { name, price, sizes, color, category, quantity, description, brand } = req.fields;

            const { image } = req.files
            const { pid } = req.params;

            switch (true) {
                case !name:
                    return res.status(500).send({ success: false, message: "name is required!!!" });
                case !price:
                    return res.status(500).send({ success: false, message: "price is required!!!" });
                case !sizes:
                    return res.status(500).send({ success: false, message: "sizes is required!!!" });
                case !color:
                    return res.status(500).send({ success: false, message: "color is required!!!" });
                case !category:
                    return res.status(500).send({ success: false, message: "category is required!!!" });
                case !quantity:
                    return res.status(500).send({ success: false, message: "quantity is required!!!" });
                case !description:
                    return res.status(500).send({ success: false, message: "description is required!!!" });
                case !brand:
                    return res.status(500).send({ success: false, message: "brand is required!!!" });
                case image && image.size > 1000000:
                    return res.status(500).send({ success: false, message: "image is required and should be less then 1 mb" });
            }
            const parsedSizes = JSON.parse(sizes);
            const product = await productModel.findByIdAndUpdate(pid, { ...req.fields, sizes: parsedSizes, slug: slugify(name) });
            if (image) {
                product.image.data = fs.readFileSync(image.path);
                product.image.contentType = image.type;
            }
            await product.save();
            res.status(200).send({ success: true, message: "product updated successsfully!!!", product });

        }
        catch (err) {
            console.log(err)
            return res.status(400).send({
                success: false,
                message: "Error while updating Product!!!",
                err
            })
        }
    }
    getAllBrands = async (req, res) => {
        try {
            const brands = await productModel.aggregate([
                {
                    $group: {
                        _id: "$brand"
                    }
                }
            ])
            return res.status(200).send({
                success: true,
                message: "Brands fetched successfully!!!",
                brands
            })
        } catch (err) {
            return res.status(400).send({
                success: false,
                message: "Error while fetching Brand!!!",
                err
            })
        }

    }
    getFilterProduct=async(req,res)=>{ 
        try{
            const perpage=3;
            const page=req.params.page?req.params.page:1;
            const {priceRange,selectedCat,selectedBrand,searchKey}=req.body;
            
            if(selectedCat.length==1 && selectedCat[0]==="dont"){
                return res.send({
                    success:false,
                    message:"hell"
                });
            }
            let query={};
            if(searchKey){
                query.$or=[{name:{$regex:searchKey,$options:"i"}},{brand:{$regex:searchKey,$options:"i"}}]
            }
            if(priceRange){
                query.price={$gte:priceRange[0],$lte:priceRange[1]}
            }
            if(selectedCat!=='undefined' && selectedCat.length>0){
                query.category={$in:selectedCat}
            }
            if(selectedBrand.length>0){
                query.brand={$in:selectedBrand}
            }
            let products=await productModel.find(query).select("-image")
            const count=products.length;
            products=await productModel.find(query).select("-image").skip((page-1)*perpage).limit(perpage).sort({createdAt:-1})
            res.status(200).send({
                success: true,
                message: "Filters fetched successfully!!!",
                products,
                count
            })
        }
        catch(err){
            console.log(err);
            return res.status(400).send({
                success: false,
                message: "Error while fetching Filter!!!",
                err
            })
        }

    }
    getproductCount=async(req,res)=>{
        try{
            const count=await productModel.find({}).estimatedDocumentCount();
            res.status(200).send({
                success:true,
                count
            })
        }
        catch(err){
            console.log(err);
            return res.status(400).send({
                success: false,
                message: "Error while fetching Filter!!!",
                err
            })
        }
        
    }
}