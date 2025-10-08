import express from "express";
import { addResturant, getResturant } from "../controller/resturant.controller";
import { upload } from "../utility/Multer";

const resturantRoute = express.Router();

resturantRoute.post("/addResturant", upload.single('image'),addResturant);
resturantRoute.get("/getResturant",getResturant);

export default resturantRoute;