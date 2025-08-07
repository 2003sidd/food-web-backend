import { Request, Response } from "express";
import orderModel from "../models/order";
import { checkInValidStringField, checkValidMongoseId, sendResponse, throwError } from "../utility/UtilityFunction";
import { mongo, Types } from "mongoose";
import IOrder from "../interface/order";
import cartModel from "../models/cart";
import logger from "../utility/wingstonLogger";

const addOrder = async (request: Request<{ id: Types.ObjectId }, {}, IOrder>, response: Response) => {
    try {
        // get the user id and place order for all the items present in the user cart
        const {userId ,paymentMode} = request.body

        if (checkValidMongoseId(userId)) {
            return sendResponse(response, 200, "user id is missing or invalid", null);
        }

        if(checkInValidStringField(paymentMode)){
            return sendResponse(response,200,"payment mode is missing",null)
        }

        const cartItems = await cartModel.find({userId});
        if(!cartItems){
            return sendResponse(response,400, "No item found in cart",null)
        }

        const foodIds = cartItems.map(item => item.menuId);

        const data = new orderModel({
            userId,
            foodId:foodIds,
            status:"pending",
            paymentMode
        })

        await data.save()

        const deleteItem = await cartModel.deleteMany({userId})
        return sendResponse(response, 200, "Order placed successfully", data);

    } catch (error) {
               logger.error("Error at adding order",error)

        throwError(response, 500, "Internal server error occured", null)
    }
}

const getOrders = async (request: Request<{ id: Types.ObjectId }, {}, IOrder>, response: Response) => {
    try {

        const { id } = request.params;

        if (checkValidMongoseId(id)) {
            return throwError(response, 400, "")
        }

        // get the user id and found all the orders related to particular user
        const orders = await orderModel.find({ userId: id });

        if (!orders || orders.length === 0) {
            return sendResponse(response, 404, "No orders found for this user", null);
        }

        return sendResponse(response, 200, "Orders fetched successfully", orders);
    } catch (error) {
                logger.error("Error at getting orders ",error)
        throwError(response, 500, "Internal server error occured", null)
    }
}


const getOrderById = async (request: Request<{ id: Types.ObjectId }, {}, IOrder>, response: Response) => {
    try {

        // here get the order id and find the particular order
        const { id } = request.params;

        if (checkValidMongoseId(id)) {
            return throwError(response, 400, "Id is missing or invalid id", null)
        }


        const order = await orderModel.findById(id);

        if (order) {
            return sendResponse(response, 200, "Order found", order)
        }

        return sendResponse(response, 200, "Order not found", null)


    } catch (error) {
        logger.error("Error at getting order by id ",error)
        throwError(response, 500, "Internal server error occured", null)
    }
}

export {getOrderById,getOrders,addOrder}