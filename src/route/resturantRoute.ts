import express from "express";
import { addResturant, getResturant } from "../controller/resturant.controller";

const resturantRoute = express.Router();

resturantRoute.post("/addResturant",addResturant);
resturantRoute.get("/getResturant",getResturant);

export default resturantRoute;