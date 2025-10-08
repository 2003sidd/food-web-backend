import express from "express"
import router from "./authRoutes"
import { addCategory, getAllCategory, getCategory, getCategoryById, toggleVisiblity } from "../controller/category.controller"
import { upload } from "../utility/Multer"
const categoryRoute = express.Router()

categoryRoute.get("/getCategory/:id", getCategory)
categoryRoute.get("/getCategory", getAllCategory)
categoryRoute.get("/getCategoryById", getCategoryById)
categoryRoute.delete("/deleteCategory", toggleVisiblity)
categoryRoute.post("/addCategory", upload.single('image'), addCategory)

// router.post("addCategory",addCategory)

export default categoryRoute; 