import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    products: [
        {
            id:{
                type: mongoose.ObjectId,
                ref: 'Products',
                required:true
            },
            size:{
                type:Number,
                required:true
            },
            quantity:{
                type:Number,
                required:true
            }
        }
 
    ],
    totalPrice:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    buyer: {
        type: mongoose.ObjectId,
        ref: 'users',
        required:true
    },
    status:{
        type:String,
        enum:["Order Placed","Shipped","Out for delivery","Delivered","Cancelled"],
    },
    razorpay_order_id:{
        type:String,
        default:null
    },    
    razorpay_payment_id:{
        type:String,
        default:null
    },    
    razorpay_signature:{
        type:String,
        default:null
    },
    date:{
        type:Date,
        default:Date.now
    }

},{timestamps:true})
const orderModel=mongoose.model("Order",orderSchema);
export default orderModel;