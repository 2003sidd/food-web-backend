import express from "express";
import { addToCart, deleteCart, deleteFromCart, getCart } from "../controller/cartController";

const cartRoute = express.Router()

cartRoute.get("/getCartItems",getCart)
cartRoute.get("/addCartItem",addToCart)
cartRoute.delete("/deleteCartItem",deleteFromCart)
cartRoute.delete("/deleteCart",deleteCart)

export default cartRoute;