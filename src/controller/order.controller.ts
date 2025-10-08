import { Request, Response } from "express";
import orderModel from "../models/order";
import { checkInValidStringField, checkValidMongoseId, sendResponse, throwError } from "../utility/UtilityFunction";
import mongoose, { mongo, Types } from "mongoose";
import IOrder from "../interface/order";
import cartModel from "../models/cart";
import logger from "../utility/wingstonLogger";
import ConfigModel from "../models/config";
import { PaymentTypeEnum } from "../enum/PaymentTypeEnum";

const addOrder = async (request: Request<{ id: Types.ObjectId }, {}, IOrder>, response: Response) => {
    try {
        // get the user id and place order for all the items present in the user cart
        const { paymentMode, address, totalPrice, platformFee, deliveryCharge } = request.body;
        const userId = request.user._id;
        if (!checkValidMongoseId(userId)) {
            return sendResponse(response, 200, "user id is missing or invalid", null);
        }

        if (!checkInValidStringField(paymentMode)) {
            return sendResponse(response, 200, "payment mode is missing", null)
        }

        if(!Object.values(PaymentTypeEnum).includes(paymentMode as PaymentTypeEnum)){
            return sendResponse(response, 200, "payment mode is incorrect", null)
            
        }


        const cartItems = await cartModel.find({ userId }).populate("menu");

        if (!cartItems || cartItems.length === 0) {
            return sendResponse(response, 400, "No item found in cart", null);
        }

        let finalTotalPrice = 0;

        const menuItem = cartItems.map(item => {
            let price = 0;
            let id = '';
            if (
                item.menu &&
                !(item.menu instanceof mongoose.Types.ObjectId) &&
                item.menu.price
            ) {
                id = item.menu._id!!
                price = item.menu.price * item.quantity;
                finalTotalPrice += price;
            }

            return {
                menu: id,
                quantity: item.quantity,
                price,
            };
        });


        const data = await ConfigModel.find();


        if (data.length > 0) {
            if (finalTotalPrice < data[0].freeDeliveryThreshold) {

                finalTotalPrice += data[0].deliveryCharge;
            }
            finalTotalPrice += data[0].platformFee;
        }


        if (finalTotalPrice !== totalPrice) {
            return sendResponse(response, 400, "Amount mismatch", null)
        }
        const orderData = new orderModel({
            userId,
            address,
            platformFee,
            deliveryCharge,
            totalPrice: finalTotalPrice,

            items: menuItem,
            status: "pending",
            paymentMode
        })

        await orderData.save()

        const deleteItem = await cartModel.deleteMany({ userId })
        return sendResponse(response, 200, "Order placed successfully", orderData);

    } catch (error) {
        logger.error("Error at adding order", error)

        throwError(response, 500, "Internal server error occured", null)
    }
}

const getOrders = async (request: Request<{ id: Types.ObjectId }, {}, IOrder>, response: Response) => {
    try {

        const userId = request.user._id;

        if (!checkValidMongoseId(userId)) {
            return throwError(response, 400, "invalid user id")
        }

        // get the user id and found all the orders related to particular user
        const orders = await orderModel.find({ userId }).populate("items.menu").populate("address");

        if (!orders || orders.length === 0) {
            return sendResponse(response, 404, "No orders found for this user", null);
        }

        return sendResponse(response, 200, "Orders fetched successfully", orders);
    } catch (error) {
        logger.error("Error at getting orders ", error)
        throwError(response, 500, "Internal server error occured", null)
    }
}


const getOrderById = async (request: Request<{ id: Types.ObjectId }, {}, IOrder>, response: Response) => {
    try {

        // here get the order id and find the particular order
        const { id } = request.params;

        if (!checkValidMongoseId(id)) {
            return throwError(response, 400, "Id is missing or invalid id", null)
        }


        const order = await orderModel.findById(id).populate("address").populate("items.menu");

        if (order) {
            return sendResponse(response, 200, "Order found", order)
        }

        return sendResponse(response, 200, "Order not found", null)


    } catch (error) {
        logger.error("Error at getting order by id ", error)
        throwError(response, 500, "Internal server error occured", null)
    }
}

export { getOrderById, getOrders, addOrder }