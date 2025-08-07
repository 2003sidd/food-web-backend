import express from "express"
import router from "./authRoutes"
import { addCategory, getAllCategory, getCategory, getCategoryById, toggleVisiblity } from "../controller/category.controller"
const categoryRoute = express.Router()

categoryRoute.get("/getCategory/:id",getCategory)
categoryRoute.get("/getCategory",getAllCategory)
categoryRoute.get("/getCategoryById",getCategoryById)
categoryRoute.delete("/deleteCategory",toggleVisiblity)
categoryRoute.post("/addCategory",addCategory)

// router.post("addCategory",addCategory)

export default categoryRoute; 