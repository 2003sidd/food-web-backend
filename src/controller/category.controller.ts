import { Request, Response } from "express";
import { ICategoryModal } from "../interface/CategoryModal";
import { checkInValidStringField, checkValidMongoseId, sendResponse, throwError } from "../utility/UtilityFunction";
import categoryModel from "../models/category.modal";
import { Types } from "mongoose";
import logger from "../utility/wingstonLogger";

const addCategory = async (request: Request<{}, {}, ICategoryModal>, response: Response) => {
    try {
        console.log("api hits")
        const { name, image, isBlocked } = request.body;
        console.log("name is ",name)
        if (!checkInValidStringField(name)) {
            return sendResponse(response, 400, "Name is required field", null)
        }

        // if (checkInValidStringField(image)) {
        //     return sendResponse(response, 400, "Image is required field", null)
        // }

        const data = await categoryModel.create({ name, image, isBlocked });
        if (data) {
            return sendResponse(response, 201, "Category created successfully", null);
        }

        return sendResponse(response, 201, "Some error occured during category creation", null);


    } catch (error) {
        logger.error("Error at add category item", error)
        throwError(response, 500, "Internal server error", null)
    }
}

const getAllCategory = async (request: Request<{}, {}, ICategoryModal>, response: Response) => {
    try {
        const categories = await categoryModel.find();

        if (categories && categories.length > 0) {
            return sendResponse(response, 200, "Categories found", categories);
        }

        return throwError(response, 200, "No category found", null)

    } catch (error) {
        logger.error("Error at get all category item", error)
        throwError(response, 500, "Internal server error", null)
    }
}

const getCategory = async (request: Request<{ _id: Types.ObjectId }, {}, ICategoryModal>, response: Response) => {
    try {

        const id = request.params._id;
        if (checkValidMongoseId(id)) {
            return sendResponse(response, 400, "Categories id mismatch", null);
        }
        const category = await categoryModel.findById(id);

        if (category) {
            return sendResponse(response, 200, "Categories found", category);
        }

        return sendResponse(response, 200, "No category found", null)
    } catch (error) {
        logger.error("Error at get category item", error)

        throwError(response, 500, "Internal server error", null)
    }
}

const getCategoryById = async (request: Request<{ id: Types.ObjectId }, {}, ICategoryModal>, response: Response) => {
    try {

        let { id } = request.params;

        if (checkValidMongoseId(id)) {
            return throwError(response, 400, "Id is missing or invalid");
        }

        const categories = await categoryModel.findById(id);

        if (categories) {
            return sendResponse(response, 200, "Categories found", categories);
        }

        return sendResponse(response, 200, "No category found", null);
    } catch (error) {
        logger.error("Error at getting category by id", error)
        throwError(response, 500, "Internal server error", null)
    }
}



const toggleVisiblity = async (request: Request<{ id: Types.ObjectId }, {}, ICategoryModal>, response: Response) => {
    try {
        const { id } = request.params;
        if (checkValidMongoseId(id)) {
            return throwError(response, 400, "Id is missing or invalid");
        }

        const category = await categoryModel.findById(id);
        if (category) {
            category.isBlocked = !category.isBlocked;
            category.save();
            await sendResponse(response, 200, "Category status changed", category)
        }

        return sendResponse(response, 200, "Category not found with the id", null);
    } catch (error) {
        logger.error("Error at toggle category visiblity item", error)

        throwError(response, 500, "Internal server error", null)
    }
}

export { addCategory, getAllCategory, getCategory, getCategoryById, toggleVisiblity }