
import { Request, response, Response } from "express";
import { checkInValidStringField, checkInValidEmail, sendResponse, throwError, checkInValidNumberField, checkInValidPhoneNum } from "../utility/UtilityFunction";
import { generateToken } from "../middelwares/jwt";
import { LoginRequest } from "../interface/LoginRequest";
import IUser from "../interface/UserInterface"
import UserModel from "../models/user";
import logger from "../utility/wingstonLogger";


const login = async (reqest: Request<{}, {}, LoginRequest>, respones: Response) => {
    try {
        let { phoneNo, password } = reqest.body;
        logger.info("login api hits")

        if (checkInValidNumberField(phoneNo) && checkInValidNumberField(phoneNo)) {
            return sendResponse(respones, 400, "Phone no is required and should be proper", null);
        }

        if (!checkInValidStringField(password)) {
            return sendResponse(respones, 400, "Password is required and should be proper", null);
        }

        const user = await UserModel.findOne({ phoneNo });
        if (user) {
            const isPasswordMatch = await user.comparePassword(password)
            if (isPasswordMatch) {
                const userWithoutPassword: IUser = user.toObject();
                delete (userWithoutPassword as any).password;
                return sendResponse(respones, 200, "Login sucessfully", user);
            } else {
                return sendResponse(respones, 200, "Password incorrect", null);
            }
        } else {
            return sendResponse(respones, 200, "User not found", null)
        }
    } catch (error) {
        logger.error("Error",error)
        throwError(respones, 500, "Internal Server Error", null)
    }
}

const Resgister = async (request: Request<{}, {}, IUser>, respones: Response) => {
    try {

        const { name, email,phoneNo, password  } = request.body;
        console.log("body is",request.body)

        if (!checkInValidStringField(name)) {
            return sendResponse(respones, 400, "Name is required", null);
        }

        if (!checkInValidStringField(phoneNo) && !checkInValidPhoneNum(phoneNo)) {
            return sendResponse(respones, 400, "Phone number is required and should be proper", null);
        }

        if (!checkInValidStringField(password)) {
            return sendResponse(respones, 400, "Password is required", null);
        }

        if(!checkInValidEmail(email)){
            return sendResponse(respones, 400, "Email is required and should be proper", null);
        }


        console.log("exist user starts")
        const existUser = await UserModel.find({ 
            $or: [{ phoneNo }, { email }]
         });
            console.log("exist user found",existUser)
            console.log("exist user length",existUser.length)
        if (existUser && existUser.length > 0) {
            console.log("enters")
            return sendResponse(respones, 400, "Already registered with the provided phone number or email", null);

            return sendResponse(response, 400, "Already registered with the provided phone number or email",null);
        }
        console.log("how but comes")


        const user = await UserModel.create({ name, phoneNo, password ,email});

        if (user) {
            const accessToken = generateToken(user.toObject());
            return sendResponse(respones, 201, "Registration successfully", { user, token: accessToken });
        }

        return sendResponse(respones, 200, "User not created try again later", null)
    } catch (error) {
        logger.error("error",error)
        throwError(respones, 500, "Internal Server Error", null)
    }
}

export { login, Resgister }