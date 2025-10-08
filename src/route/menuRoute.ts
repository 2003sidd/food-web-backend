import express from "express"
import { addMenu, getAllMenu, getMenuByCategory, getMenuByResturant, markUnavailable } from "../controller/menu.controller"
import { upload } from "../utility/Multer"
const menuRoute = express.Router()

menuRoute.delete("/deleteMenu", markUnavailable)
menuRoute.post("/addMenu", upload.single('image'), addMenu)
menuRoute.get("/getMenuByResturant/:id", getMenuByResturant)
menuRoute.get("/getMenuByCategory/:id", getMenuByCategory)
menuRoute.get("/getMenu", getAllMenu)

export default menuRoute