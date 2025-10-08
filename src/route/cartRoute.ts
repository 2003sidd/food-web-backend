import express from "express";
import { CartQuantityUpsert, deleteCart, deleteFromCart, getCart, getCheckout } from "../controller/cartController";

const cartRoute = express.Router()

cartRoute.get("/getCartItems",getCart)
cartRoute.get("/checkout",getCheckout)
cartRoute.post("/updateCartItem",CartQuantityUpsert)
cartRoute.delete("/deleteCartItem/:id",deleteFromCart)
cartRoute.delete("/deleteCart",deleteCart)

export default cartRoute;