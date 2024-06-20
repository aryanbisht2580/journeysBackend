
import orderModel from "../models/orderModel.js"

export default class orderController {
    getAllOrders = async (req, res) => {
        try {
            await orderModel.deleteMany({ status: null });
            // const orders=await orderModel.find({buyer:req.user._id}).populate("Product","-image").populate("buyer","name").sort({createdAt:-1});
            const orders = await orderModel.find({ buyer: req.user._id }).populate("products.id", "-image").populate("buyer", "name").sort({ createdAt: -1 });
            return res.status(200).send({ success: true, orders })
        } catch (err) {
            console.log(err);
            return res.status(500).send({ success: false, message: "error while fetching Orders" })
        }
    }
    getAdminOrders = async (req, res) => {
        try {
            await orderModel.deleteMany({ status: null });
            const orders = await orderModel.find().populate("products.id", "-image").populate("buyer", "name").sort({ createdAt: -1 });
            return res.status(200).send({ success: true, orders })
        } catch (err) {
            console.log(err);
            return res.status(500).send({ success: false, message: "error while fetching Orders" })
        }
    }
    changeStatus = async (req, res) => {
        try {
            const { orderId, status } = req.body;
            console.log(req.body);
            await orderModel.findByIdAndUpdate(orderId, { status })
            return res.status(200).send({ success: true, message:"status changed" })
        } catch (err) {
            console.log(err);
            return res.status(500).send({ success: false, message: "error while fetching Orders" })
        }
    }
}