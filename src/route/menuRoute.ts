import express from "express"
import { addMenu, getAllMenu, getMenuByCategory, getMenuByResturant, markUnavailable } from "../controller/menu.controller"
const menuRoute = express.Router()

menuRoute.delete("/deleteMenu",markUnavailable)
menuRoute.post("/addMenu",addMenu)
menuRoute.get("/getMenuByResturant/:id",getMenuByResturant)
menuRoute.get("/getMenuByCategory/:id",getMenuByCategory)
menuRoute.get("/getMenu",getAllMenu)

export default menuRoute