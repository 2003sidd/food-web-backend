
import { Request, response, Response } from "express";
import { checkInValidStringField, checkInValidEmail, sendResponse, throwError, checkInValidNumberField, checkInValidPhoneNum } from "../utility/UtilityFunction";
import { generateToken } from "../middelwares/jwt";
import { LoginRequest } from "../interface/LoginRequest";
import IUser from "../interface/UserInterface"
import UserModel from "../models/user";
import logger from "../utility/wingstonLogger";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";


const login = async (reqest: Request<{}, {}, LoginRequest>, respones: Response) => {
    try {
        let { email, password } = reqest.body;
        logger.info("login api hits")

        // if (checkInValidNumberField(phoneNo) && checkInValidNumberField(phoneNo)) {
        //     return sendResponse(respones, 400, "Phone no is required and should be proper", null);
        // }

        if (!checkInValidStringField(password)) {
            return sendResponse(respones, 400, "Password is required and should be proper", null);
        }
        const user = await UserModel.findOne({ email });
        if (user) {
            const isPasswordMatch = await user.comparePassword(password)
            if (isPasswordMatch) {
                const userWithoutPassword: IUser = user.toObject();
                delete (userWithoutPassword as any).password;
                const authToken = await generateToken(userWithoutPassword);

                return sendResponse(respones, 200, "Login sucessfully", { user, authToken });
            } else {
                return sendResponse(respones, 200, "Password incorrect", null);
            }
        } else {
            return sendResponse(respones, 200, "User not found", null)
        }
    } catch (error) {
        logger.error("Error", error)
        throwError(respones, 500, "Internal Server Error", null)
    }
}

const Resgister = async (request: Request<{}, {}, IUser>, respones: Response) => {
    try {

        const { name, email, phoneNo, password } = request.body;

        if (!checkInValidStringField(name)) {
            return sendResponse(respones, 400, "Name is required", null);
        }

        if (!checkInValidStringField(phoneNo) && !checkInValidPhoneNum(phoneNo)) {
            return sendResponse(respones, 400, "Phone number is required and should be proper", null);
        }

        if (!checkInValidStringField(password)) {
            return sendResponse(respones, 400, "Password is required", null);
        }

        if (!checkInValidEmail(email)) {
            return sendResponse(respones, 400, "Email is required and should be proper", null);
        }

        const existUser = await UserModel.find({
            $or: [{ phoneNo }, { email }]
        });
        if (existUser && existUser.length > 0) {
            return sendResponse(respones, 400, "Already registered with the provided phone number or email", null);

            return sendResponse(response, 400, "Already registered with the provided phone number or email", null);
        }


        const user = await UserModel.create({ name, phoneNo, password, email });

        if (user) {
            const accessToken = generateToken(user.toObject());
            return sendResponse(respones, 201, "Registration successfully", { user, token: accessToken });
        }

        return sendResponse(respones, 200, "User not created try again later", null)
    } catch (error) {
        logger.error("error", error)
        throwError(respones, 500, "Internal Server Error", null)
    }
}

const sendMail = async (name: string, email: string): Promise<boolean> => {
    try {

        const mailerSend = new MailerSend({
            apiKey: process.env.API_KEY!!,
        });

        const sentFrom = new Sender("quickbite@gmail.com", "Quick Bite");

        const recipients = [
            new Recipient(email, name)
        ];

        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setReplyTo(sentFrom)
            .setSubject("OTP Verification at Quick bite")
            .setHtml("Greetings from the team, you got this message through MailerSend.")
            .setText("Greetings from the team, you got this message through MailerSend.");

        await mailerSend.email.send(emailParams);
        return true;
    } catch (error) {
        logger.error("Error", error)
        return false
    }
}
export { login, Resgister, sendMail }