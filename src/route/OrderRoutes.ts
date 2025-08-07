import express from "express";
import router from "./authRoutes";
import { addOrder, getOrderById, getOrders } from "../controller/order.controller";
const orderRouter = express.Router();


router.get("/getOrderById/:id",getOrderById)
router.get("/getOrders",getOrders)
router.post("/addOrders",addOrder)

export default orderRouter;