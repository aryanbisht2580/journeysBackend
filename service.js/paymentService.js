import { message } from "antd";
import { razorpay } from "../config/razorPay.js";

import orderModel from "../models/orderModel.js";

export const cPaymentLink=async({cart,user,address,totalPrice})=>{
    try{
        const products=cart.map((c)=>({id:c._id,size:c.selectedSize,quantity:c.count}))
        address=(address.address+" "+address.city+" "+address.state+" "+address.pin)

        const paymentLinkRequest={
            amount:totalPrice*100,
            currency:"INR",
            customer:{
                name:user.name,
                contact:"+91"+user.phone,
                email:user.email,
                address
            },
            notify:{
                sms:true,
                email:true
            },
            callback_url:`http://localhost:3000/dashboard/user/orders`,
            callback_method:'get'
        }
        const paymentLink=await razorpay.paymentLink.create(paymentLinkRequest);
        console.log("id:  "+paymentLink.id)
        const paymentLinkUrl=paymentLink.short_url;
        const paymentLinkId=paymentLink.id;
        const order=new orderModel({products,totalPrice,address,buyer:user._id,paymentId:paymentLinkId})
        await order.save()
        console.log(order)
        const payment=await razorpay.payments.fetch(paymentLinkId);
        console.log(payment)
        
        const result= {paymentLinkUrl,paymentLinkId};
        return result;
    }
    catch(err){
        console.log(err);
        throw new Error(err.message)
    }
}
export const addOrder=async (orderId)=>{
    try{
        const order=await orderModel.findById(orderId);
        const result={success:true};
        if(order.paymentStatus){
            return result
        }
       
        const payment=await razorpay.payments.fetch(order.paymentId);
        // console.log("hello");
       
        if(payment.status=="captured" && !order.paymentStatus){
            order.paymentStatus="Completed";
            order.status="Order Placed"
            await order.save();
            result={success:true,message:"Your order is placed!!!"}
        }
        
        return result;
    }catch(err){
        console.log(err);
        throw new Error(err.message)
    }
}
export const createOrder=async(req,res)=>{
    try{

    }catch(err){

    }
}