import { Request, Response } from "express";

import { checkInValidNumberField, checkInValidStringField, checkValidMongoseId, sendResponse, throwError } from "../utility/UtilityFunction";
import { Types } from "mongoose";
import MenuModel from "../models/menu";
import { IMenuItem } from "../interface/MenuInterface";
import logger from "../utility/wingstonLogger";
import menuRoute from "../route/menuRoute";
import RestaurantModel from "../models/resturant";

const addMenu = async (request: Request, response: Response) => {
    try {
        const { name, image, description, category,vegMeal, price, restaurant_id } = request.body;

        // if (!checkInValidStringField(image)) {
        //     return sendResponse(response, 400, "Image is required field", null)
        // }

        if (!checkInValidStringField(name)) {
            return sendResponse(response, 400, "name is required field", null)
        }

        if (!checkInValidStringField(description)) {
            return sendResponse(response, 400, "description is required field", null)
        }

        // if (!checkValidMongoseId(category)) {
        //     return sendResponse(response, 400, "category id is missing or invalid", null)
        // }

        // if (!checkValidMongoseId(category)) {
        //     return sendResponse(response, 400, "category id is missing or invalid", null)
        // }
        // if (checkValidMongoseId(restaurant_id)) {
        //     return sendResponse(response, 400, "resturant id is missing or invalid", null)
        // }

        if (!checkInValidNumberField(price)) {
            return sendResponse(response, 400, "price should be number and greater than zero", null)
        }

        // if (!Array.isArray(specifications)) {
        //     return sendResponse(response, 400, "Specifications should be an array", null);
        // }

        // for (let spec of specifications) {
        //     // Validate Key (should be a non-empty string)
        //     if (typeof spec.key !== "string" || spec.key.trim() === "") {
        //         return sendResponse(response, 400, "Each specification must have a valid 'key' as a non-empty string", null);
        //     }

        //     // Validate Value (should be of type string, number, boolean, or object)
        //     if (spec.value === undefined || spec.value === null) {
        //         return sendResponse(response, 400, "Each specification must have a valid 'value'", null);
        //     }

        //     if (
        //         !(typeof spec.value === "string" || typeof spec.value === "number" || typeof spec.value === "boolean" || typeof spec.value === "object")
        //     ) {
        //         return sendResponse(response, 400, "Each specification's 'value' must be a string, number, boolean, or object", null);
        //     }
        // }



        // Assuming you have a function to add food to the database:
        const newFood = new MenuModel({
            name,
            image,
            description,
            category,
            vegMeal,
            price,
            restaurant_id
        });

        await newFood.save();
        return sendResponse(response, 201, "Food added successfully", newFood);

    } catch (error) {
        logger.error("Error at adding food item", error)
        throwError(response, 500, "Internal server error", null)
    }

}

const markUnavailable = async (request: Request<{ id: Types.ObjectId }, {}, IMenuItem>, response: Response) => {
    try {
        const { id } = request.params

        if (checkValidMongoseId(id)) {
            return sendResponse(response, 400, "id is missing or invalid", null)
        }

        const itemDetelete = await MenuModel.findOne({ _id: id });

        if (itemDetelete) {
            return sendResponse(response, 200, "Food item mark unavailable", itemDetelete)
        }

        return sendResponse(response, 200, "Error occured during deleting food", null)

    } catch (error) {
        logger.error("Error at marking unavailable food item", error)
        throwError(response, 500, "Internal server error", null)
    }

}

const getAllMenu = async (req:Request,res:Response)=>{
    try {
        const data = await MenuModel.find();

        if(data )
            return sendResponse(res,200,"Menu found",data);
        
        return sendResponse(res,200,"Menu not found",null);
    } catch (error) {
         logger.error("Error at getting all menu item", error)
        throwError(res, 500, "Internal server error", null)
    }
}

const getMenuByResturant  = async (req:Request,res:Response) =>{
    try {
        // resturant id
        const id = req.params.id;

        const data = await MenuModel.find({restaurant_id:id});

        if(data)
            return sendResponse(res,200,"Get all menu by resturant",data);
        
        return sendResponse(res,200,"Menu not found by resturant",null);
    } catch (error) {
         logger.error("Error at getting all menu by resturant item", error)
        throwError(res, 500, "Internal server error", null)
    }
}

const getMenuByCategory  = async (req:Request,res:Response) =>{
    try {
        // category id
        const id = req.params.id;

        const data = await MenuModel.find({category:id});

        console.log("data is",data)

        if(data)
            return sendResponse(res,200,"Get all menu by resturant",data);
        
        return sendResponse(res,200,"Menu not found by resturant",null);
    } catch (error) {
         logger.error("Error at getting all menu by resturant item", error)
        throwError(res, 500, "Internal server error", null)
    }
}

export { addMenu, markUnavailable, getAllMenu, getMenuByResturant, getMenuByCategory }
