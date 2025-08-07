import { Request, Response } from "express";
import { IAddressModal } from "../interface/AddressModal";
import addressModal from "../models/address.modal";
import { checkInValidStringField, checkValidMongoseId, sendResponse, throwError } from "../utility/UtilityFunction";
import logger from "../utility/wingstonLogger";
import { Types } from "mongoose";

const addAddress = async (request: Request<{}, {}, IAddressModal>, response: Response) => {
    try {

        const { street, city, state, country, userId } = request.body;

        if (checkInValidStringField(street)) {
            return sendResponse(response, 400, "Street is required field", null)
        }

        if (checkInValidStringField(city)) {
            return sendResponse(response, 400, "city is required field", null)
        }

        if (checkInValidStringField(state)) {
            return sendResponse(response, 400, "state is required field", null)
        }

        if (checkInValidStringField(country)) {
            return sendResponse(response, 400, "country is required field", null)
        }

        if (checkValidMongoseId(userId)) {
            return sendResponse(response, 400, "UserId is required field",null)
        }

        const address = await addressModal.create({ state, street, city, country, userId });
        if (address) {
            
        }


        sendResponse(response, 400, "userId is required field", null)

    } catch (error) {
         logger.error("error at adding address is", error)
        throwError(response, 500, "Internal server error", null);
    }
}


const getAddresses = async (request: Request<{}, {}, IAddressModal>, response: Response) => {
    try {
        console.log("User",request)
        const address = await addressModal.find({ isBlocked: true ,userId:request.user._id});

        if (address && address.length > 0) {
            return sendResponse(response, 200, "address found", address);
        }

        return sendResponse(response, 200, "No category found", null)
    } catch (error) {
          logger.error("error at getting address is", error)
        throwError(response, 500, "Internal server error", null);
    }
}



const deleteAddress = async (request: Request<{ id: Types.ObjectId }, {}, IAddressModal>, response: Response) => {
    try {
        const addressId = request.params.id;

        if (checkValidMongoseId(addressId)) {
            return throwError(response, 400, "Invalid address id", null);
        }

        const address = await addressModal.findById(addressId);

        if (address) {
            address.isActive = false;
            await address.save();

            return sendResponse(response, 201, "Address deleted successfully", true)
        }

        return sendResponse(response, 400, "Error at Address deleted", false)

    } catch (error) {
        logger.error("error at deleting address is", error)
        throwError(response, 500, "Internal server error", null);
    }
}

export {addAddress, getAddresses, deleteAddress}