import mongoose, { Schema } from "mongoose";
import IOrder, { IOrderItem } from "../interface/order";
import { PaymentTypeEnum } from "../enum/PaymentTypeEnum";
import { OrderStatusEnum } from "../enum/OrderStatusEnum";

const orderItemSchema: Schema = new mongoose.Schema<IOrderItem>(
    {
        menu: {
            type: Schema.Types.ObjectId,
            ref: "MenuItem",
            required: true,
        },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
    }
);

const orderSchema: Schema = new mongoose.Schema<IOrder>(
    {
   
        userId: { type: Schema.Types.ObjectId, required: true },
        totalPrice: { type: Number, required: true },
        items: [orderItemSchema],
        status: {
            type: String,
            enum: Object.values(OrderStatusEnum),
            required: true,
            default: "pending"
        },
        paymentMode: {
            type: String,
            enum: Object.values(PaymentTypeEnum),
            required: true,
        },
        platformFee:{
            type:Number,
            requried:true
        },
        address:{
            type:mongoose.Schema.ObjectId,
            required:true,
            ref:"Address"
        },
        deliveryCharge:{
            type:Number,
            requried:true
        }

    },
    { timestamps: true }
);

const orderModel = mongoose.model<IOrder>("Order", orderSchema);

export default orderModel; 