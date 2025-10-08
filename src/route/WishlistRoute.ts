import express from "express";
import { getAllWishlistItem, moveToCart, toggleWishlistItem } from "../controller/wishlist.controller";

const wishlistRouter = express.Router();

wishlistRouter.get("/wishlistItem", getAllWishlistItem);
wishlistRouter.post("/moveWishlistItem", moveToCart);
wishlistRouter.get("/toggleCartItem/:id", toggleWishlistItem);

export default wishlistRouter; 