import RestaurantModel from "../models/resturant";
import { Request, Response } from "express";
import logger from "../utility/wingstonLogger";
import { sendResponse } from "../utility/UtilityFunction";
const addResturant = async (req: Request, res: Response) => {
    try {
        const {name,address, phone_number} = req.body;

        const existingResturant = await RestaurantModel.findOne({name});
        if(existingResturant){
            return sendResponse(res,400,"Resturant already exist",null)
        };

        const data = await RestaurantModel.create({name,address,phone_number});

        if(data){
            return sendResponse(res,201,"Resturant created successfully",data);
        }
            return sendResponse(res,500,"Resturant not created ",null);
        
    } catch (error) {
        logger.error("error at creating resturant is", error);
        sendResponse(res, 500, "Internal Server Error", null);
    }
};

const getResturant = async (req:Request, res:Response) =>{
    try{
        const data = await RestaurantModel.find();

        if(data){
            return sendResponse(res,200,"Resturant found",data);
        }
        return sendResponse(res,200,"Resturant not found",null);
    } catch (error) {
        logger.error("error at creating resturant is", error);
        sendResponse(res, 500, "Internal Server Error", null);
    }

}

export {addResturant, getResturant};
