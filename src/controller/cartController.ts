import { Request, Response } from "express";
import { checkValidMongoseId, sendResponse, throwError } from "../utility/UtilityFunction";
import { Types } from "mongoose";
import cartModel from "../models/cart";
import ICart from "../interface/cartInterface";
import logger from "../utility/wingstonLogger";

const addToCart = async (request: Request<{}, {}, ICart>, response: Response) => {
    try {
        const { menuId, quantity, userId } = request.body;
        if (checkValidMongoseId(menuId)) {
            return throwError(response, 400, "Food id is missing or invalid", null);
        }
        if (checkValidMongoseId(userId)) {
            return throwError(response, 400, "user id is missing or invalid", null);
        }
        if (quantity != undefined && quantity <= 0) {
            return throwError(response, 400, "quantity must be greater than zero", null);
        }
        // Check if the cart item already exists
        const existingCartItem = await cartModel.findOne({ userId, menuId });

        if (existingCartItem) {
            // Update quantity
            existingCartItem.quantity += quantity;
            await existingCartItem.save();
            return response.status(200).json({
                success: true,
                message: "Cart updated successfully",
                data: existingCartItem
            });
        } else {
            // Create new cart item
            const newCartItem = await cartModel.create({
                userId,
                menuId,
                quantity
            });
            return response.status(201).json({
                success: true,
                message: "Item added to cart",
                data: newCartItem
            });
        }
    } catch (error) {
                             logger.error("Error at adding items in cart",error)
        throwError(response, 500, "Internal server error", null)
    }
};


const deleteFromCart = async (request: Request<{ id: Types.ObjectId }, {}, {}>, response: Response) => {
    try {
        const userId = request.params.id;
        if (checkValidMongoseId(userId)) {
            return throwError(response, 400, "Invalid id or it is missing", null);
        }

        const data = await cartModel.deleteMany({ userId });
        if (data.deletedCount == 0) {
            return sendResponse(response, 200, "No item found", null);
        }

        return sendResponse(response, 200, "Cart deleted successfully", null);


    } catch (error) {
                            logger.error("Error while deleting item from cart",error)
        throwError(response, 500, "Internal server error", null)
    }
};

const deleteCart = async (request: Request<{ id: Types.ObjectId }, {}, {}>, response: Response) => {
    try {
        const id = request.params.id;

        if (checkValidMongoseId(id)) {
            return throwError(response, 400, "Id is required or invalid", null)
        }
        const data = await cartModel.findByIdAndDelete(id);
        if (data) {
            return sendResponse(response, 200, "Cart items have been deleted successfully", null);
        }
        return sendResponse(response, 200, "Some error occured during deleting cart item", null);

    } catch (error) {
                                   logger.error("Error while deleting cart",error)

        throwError(response, 500, "Internal server error", null)
    }
}

const getCart = async (request: Request<{ userId: Types.ObjectId }, {}, {}>, response: Response) => {
    try {
        const userId = request.params.userId;
        if (checkValidMongoseId(userId)) {
            return throwError(response, 400, "Id is required or invalid", null)
        }

        const cartItem = await cartModel.find({ userId });

        if (cartItem.length > 0) {
            return sendResponse(response, 200, "Cart item found", cartItem);
        } else {
            return sendResponse(response, 200, "Cart item not found", null);
        }

    } catch (error) {
        logger.error("error at getting items from cart", error)
        throwError(response, 500, "Internal server error", null)

    }
}

export { addToCart, deleteCart, deleteFromCart, getCart }