
import { cPaymentLink, addOrder } from "../service.js/paymentService.js"
import { razorpay } from "../config/razorPay.js";
import crypto from 'crypto'
import orderModel from "../models/orderModel.js";
export default class paymentController {
    createPaymentLink = async (req, res) => {
        try {
            const paymentLink = await cPaymentLink(req.body);
            return res.status(200).send({ success: true, paymentLink });
        }
        catch (err) {
            return res.status(500).send({ success: false, message: err.message })
        }
    }
    updatePaymentInfo = async (req, res) => {
        try {
            const result = await addOrder(req.params.orderId);
            return res.status(200).send({ success: true, result });
        }
        catch (err) {
            return res.status(500).send({ success: false, message: err.message })
        }
    }
    createOrder = async (req, res) => {
        try {
            let { cart, user, address, totalPrice } = req.body
            const products = cart.map((c) => ({ id: c.product._id, size: c.size, quantity: c.quantity }))
            address = (address.address + " " + address.city + " " + address.state + " " + address.pin)
            const options = {
                amount: totalPrice * 100,
                currency: "INR",
                receipt: crypto.randomBytes(10).toString("hex"),
                
            }
            razorpay.orders.create(options, async (err, order) => {
                if (err) {
                    console.log(err);
                    return res.status(404).send({ success: false });
                }
                const neworder = new orderModel({ products, totalPrice, address, buyer: user._id, orderId: order._id })
                await neworder.save()
                return res.status(200).send({
                    success: true,
                    order,
                    neworderId:neworder._id
                })
            });
        } catch (err) {
            console.log(err);
            throw new Error(err.message)
        }

    }
    verifyOrder=async(req,res)=>{
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const {orderId}=req.params
        try {
            // Create Sign
            const sign = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSign = crypto.createHmac("sha256", process.env.KEY_SECRET)
            .update(sign.toString())
            .digest("hex");
            const isAuthentic = expectedSign === razorpay_signature;
            if (isAuthentic) {
                let order=await orderModel.findById(orderId);
                order.razorpay_order_id=razorpay_order_id;
                order.razorpay_payment_id=razorpay_payment_id;
                order.razorpay_signature=razorpay_signature;
                order.status="Order Placed"
                await order.save();
                res.send(order);
            }
            else{
                let order=await orderModel.findByIdAndDelete(orderId);
                await order.save();
                throw new Error("Not payment");
            }
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error!" });
            console.log(error);
        }
    }


}