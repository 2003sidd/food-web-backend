import express from "express";
import router from "./authRoutes";
import { addOrder, getOrderById, getOrders } from "../controller/order.controller";
const orderRouter = express.Router();


orderRouter.get("/getOrderById/:id", getOrderById)
orderRouter.get("/getOrders", getOrders)
orderRouter.post("/placeOrder", addOrder)


export default orderRouter;