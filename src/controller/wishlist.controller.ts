import { Request, Response } from "express";
import WishlistModel from "../models/wishlist.modal";
import IWishlist from "../interface/Wishlist.interface";
import { checkValidMongoseId, sendResponse, throwError } from "../utility/UtilityFunction";
import logger from "../utility/wingstonLogger";
import mongoose, { mongo, Types } from "mongoose";
import { request } from "http";
import cartModel from "../models/cart";

const toggleWishlistItem = async (request: Request<{ id: Types.ObjectId }, {}, IWishlist>, response: Response) => {
    try {
        const menuId = request.params.id;
        const userId = request.user._id;

        if (!checkValidMongoseId(userId)) {
            return sendResponse(response, 400, "UserId is not valid", null);
        }

        if (!checkValidMongoseId(menuId)) {
            return sendResponse(response, 400, "id is not valid", null);
        }

        const existingEntry = await WishlistModel.findOne({ userId, menuId });

        if (existingEntry) {
            // Remove from wishlist
            await WishlistModel.deleteOne({ _id: existingEntry._id });

            return sendResponse(response, 200, "Removed from wishlist", true);
        } else {
            // Add to wishlist
            const newEntry = await WishlistModel.create({
                userId,
                menuId
            });

            return sendResponse(response, 201, "Added to wishlist", true);
        }


    } catch (error) {
        throwError(response, 500, "Internal Server Error", null);
        logger.error("Error at changing cart items is ", error)
    }
};

const getAllWishlistItem = async (request: Request<{}, {}, IWishlist>, response: Response) => {
    try {
        const userId = request.user._id;

        if (!checkValidMongoseId(userId)) {
            return sendResponse(response, 400, "UserId is not valid", null);
        }

        const wishlistData = await WishlistModel.find({ userId }).populate("menuId");

        console.log("wishlist data",wishlistData)

        if (wishlistData && wishlistData.length > 0) {
            return sendResponse(response, 200, "Wishlist item found", wishlistData);
        }
        return sendResponse(response, 200, "Wishlist item not found", null);
    } catch (error) {
        throwError(response, 500, "Internal Server Error", null);
        logger.error("Error at getting all cart items is ", error)
    }
};

const moveToCart = async (request: Request, response: Response) => {
    // const session = await mongoose.startSession();

    try {
        const { menuId, wishlistId } = request.body;
        const userId = request.user._id || null;

        // Validate IDs
        if (!checkValidMongoseId(menuId)) {
            return sendResponse(response, 400, "Menu ID is invalid", false);
        }

        if (!checkValidMongoseId(wishlistId)) {
            return sendResponse(response, 400, "Wishlist ID is invalid", false);
        }

        // session.startTransaction();

        // Check if wishlist item exists
        const wishlistItem = await WishlistModel.findById(wishlistId);
        // const wishlistItem = await WishlistModel.findById(wishlistId).session(session);
        if (!wishlistItem) {
            // await session.abortTransaction();
            return sendResponse(response, 400, "Wishlist item not found", false);
        }

        // Delete the wishlist item
        await WishlistModel.findByIdAndDelete(wishlistId);
        // await WishlistModel.findByIdAndDelete(wishlistId).session(session);

        // Check if item already in cart
        const existingCartItem = await cartModel.findOne({ userId, menu: menuId });
        // const existingCartItem = await cartModel.findOne({ userId, menu: menuId }).session(session);

        if (existingCartItem) {
            // Increase quantity (if desired) or leave as 1 — logic unclear from original
            existingCartItem.quantity += 1;

            if (existingCartItem.quantity <= 0) {
                // await session.abortTransaction();
                return throwError(response, 400, "Quantity became zero", null);
            }

            await existingCartItem.save();
            // await existingCartItem.save({ session });
        } else {
            // Create new cart item
            // await cartModel.create([{ userId, menu: menuId, quantity: 1 }], { session });
            await cartModel.create([{ userId, menu: menuId, quantity: 1 }]);
        }

        // await session.commitTransaction();
        return sendResponse(response, 200, "Item moved to cart", true);
    } catch (error) {
        // await session.abortTransaction();
        logger.error("Error in moveToCart:", error);
        return throwError(response, 500, "Internal Server Error", null);
    } finally {
        // session.endSession();
    }
};

export { getAllWishlistItem, toggleWishlistItem, moveToCart };

