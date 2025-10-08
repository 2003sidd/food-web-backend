import { Request, Response } from "express";
import { checkValidMongoseId, sendResponse, throwError } from "../utility/UtilityFunction";
import mongoose, { Types } from "mongoose";
import cartModel from "../models/cart";
import ICart from "../interface/cartInterface";
import logger from "../utility/wingstonLogger";
import ConfigModel from "../models/config";
import { IConfig } from "../interface/configInterface";
import addressModal from "../models/address.modal";

const CartQuantityUpsert = async (request: Request<{}, {}, ICart>, response: Response) => {
    try {
        const { menu, quantity } = request.body;
        const userId = request.user._id || null;


        if (menu instanceof mongoose.Types.ObjectId && !checkValidMongoseId(menu)) {
            return throwError(response, 400, "Food id is missing or invalid", null);
        }
        if (!checkValidMongoseId(userId || request.user._id)) {
            return throwError(response, 400, "user id is missing or invalid", null);
        }
        if (quantity == undefined) {
            return throwError(response, 400, "quantity is invalid", null);
        }
        // Check if the cart item already exists
        const existingCartItem = await cartModel.findOne({ userId, menu });

        if (existingCartItem) {
            existingCartItem.quantity = quantity;

            if (existingCartItem.quantity <= 0) {
                return throwError(response, 400, "quantity become zero", null);
            }
            await existingCartItem.save();
        } else {
            await cartModel.create({ userId, menu, quantity });
        }

        return sendResponse(response, 201, "Cart updated successfully", true);



    } catch (error) {
        logger.error("Error at adding items in cart", error)
        throwError(response, 500, "Internal server error", null)
    }
};


const deleteCart = async (request: Request<{ id: Types.ObjectId }, {}, {}>, response: Response) => {
    try {
        const userId = request.user._id || null;
        if (checkValidMongoseId(userId)) {
            return throwError(response, 400, "Invalid id or it is missing", null);
        }

        const data = await cartModel.deleteMany({ userId });
        if (data.deletedCount == 0) {
            return sendResponse(response, 200, "No item found", null);
        }

        return sendResponse(response, 200, "Cart deleted successfully", null);


    } catch (error) {
        logger.error("Error while deleting item from cart", error)
        throwError(response, 500, "Internal server error", null)
    }
};

const deleteFromCart = async (request: Request<{ id: Types.ObjectId }, {}, {}>, response: Response) => {
    try {
        const id = request.params.id || null;
        if (!checkValidMongoseId(id)) {
            return throwError(response, 400, "Id is required or invalid", null)
        }
        const data = await cartModel.findByIdAndDelete(id);
        if (data) {
            return sendResponse(response, 200, "Cart items have been deleted successfully", true);
        }
        return sendResponse(response, 200, "Some error occured during deleting cart item", null);

    } catch (error) {
        logger.error("Error while deleting cart", error)

        throwError(response, 500, "Internal server error", null)
    }
}

const getCart = async (request: Request<{ userId: Types.ObjectId }, {}, {}>, response: Response) => {
    try {
        const userId = request.user._id;
        if (!checkValidMongoseId(userId)) {
            return throwError(response, 400, "Id is required or invalid", null)
        }

        const cartItem = await cartModel.find({ userId })
            .populate('menu')   // fetch full Menu object


        if (cartItem.length > 0) {
            let totalPrice = 0;
            cartItem.forEach((item) => {
                if (item.menu && !(item.menu instanceof mongoose.Types.ObjectId) && item.menu.price) {
                    totalPrice += item.quantity * item.menu.price;
                } else {
                    // Handle case where menu is not populated correctly or price is missing
                    logger.warn(`MenuItem for cart ${item._id} is missing price.`);
                }
            })
            let price = totalPrice;

            const data = await ConfigModel.find();

            let configData: any = {};
            if (data.length > 0) {
                if (totalPrice >= data[0].freeDeliveryThreshold) {
                    configData.deliveryCharge = 0;
                    totalPrice+=0;
                } else {
                    totalPrice+=data[0].deliveryCharge;
                    configData.deliveryCharge = data[0].deliveryCharge;
                }
                totalPrice+= data[0].platformFee
                configData.paymentModes = data[0].paymentModes;
            }

            const addressData = await addressModal.find({ userId });

            return sendResponse(response, 200, "Cart item found", { cartItem, totalPrice,price, configData, address: addressData });


        } else {
            return sendResponse(response, 200, "Cart item not found", null);
        }
    } catch (error) {
        logger.error("error at getting items from cart", error)
        throwError(response, 500, "Internal server error", null)

    }
}

const getCheckout = async (request: Request<{ userId: Types.ObjectId }, {}, {}>, response: Response) => {
    try {
        const userId = request.user._id;
        if (!checkValidMongoseId(userId)) {
            return throwError(response, 400, "Id is required or invalid", null)
        }

        const cartItem = await cartModel.find({ userId })
            .populate('menu')   // fetch full Menu object


        if (cartItem.length > 0) {
            let totalPrice = 0;
            cartItem.forEach((item) => {
                if (item.menu && !(item.menu instanceof mongoose.Types.ObjectId) && item.menu.price) {
                    totalPrice += item.quantity * item.menu.price;
                } else {
                    // Handle case where menu is not populated correctly or price is missing
                    logger.warn(`MenuItem for cart ${item._id} is missing price.`);
                }
            })
            let price = totalPrice;

            const data = await ConfigModel.find();

            let configData: any = {};
            if (data.length > 0) {
                if (totalPrice >= data[0].freeDeliveryThreshold) {
                    configData.deliveryCharge = 0;
                } else {
                    totalPrice+=data[0].deliveryCharge;
                    configData.deliveryCharge = data[0].deliveryCharge;
                }
                totalPrice+=data[0].platformFee;
                configData.paymentModes = data[0].paymentModes;
            }

            const addressData = await addressModal.find({ userId });

            return sendResponse(response, 200, "Cart item found", { cartItem,price, totalPrice, configData, address: addressData });
        } else {
            return sendResponse(response, 200, "Cart item not found", null);
        }
    } catch (error) {
        logger.error("error at getting items from cart", error)
        throwError(response, 500, "Internal server error", null)

    }
}

export { CartQuantityUpsert, deleteCart, deleteFromCart, getCart, getCheckout }