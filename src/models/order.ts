import mongoose, { Schema } from "mongoose";
import IOrder, { IOrderItem } from "../interface/order";
import { PaymentTypeEnum } from "../enum/PaymentTypeEnum";
import { OrderStatusEnum } from "../enum/OrderStatusEnum";

const orderItemSchema: Schema = new mongoose.Schema<IOrderItem>(
    {
        restaurantName: { type: String, required: true },
        menuId: {
            type: Schema.Types.ObjectId,
            ref: "Menu",
            required: true,
        },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
    }
);

const orderSchema: Schema = new mongoose.Schema<IOrder>(
    {
        orderId: { type: Schema.Types.ObjectId, required: true },
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
            default: "cash"
        }

    },
    { timestamps: true }
);

const orderModel = mongoose.model<IOrder>("Order", orderSchema);

export default orderModel; 