import mongoose, { Types } from "mongoose"
import ApiResponse from "./ApIResponse"
import { Response } from "express"
import ApiError from "./ApiError"


const sendResponse = (res:Response , statusCode:number, message:string ="DataFound",data:any)=>{
    return res.status(statusCode).json(
         new ApiResponse(statusCode,data,message)
        );
 }
 
 const throwError = (res :Response, statusCode:number, errorMessage ="Internal server error",data=null)=>{
     return res.status(statusCode).json(
         new ApiError(statusCode,errorMessage,data)
        );
 };

 const checkInValidStringField = (data:String)=>{
    if (typeof data == "undefined" || data.trim() === "") {
        return false;
    };
    return true;
};

const checkInValidNumberField = (data: any): boolean => {
    return typeof data === "number" && !isNaN(data) && data > 0;
};


const checkValidMongoseId = (_id:Types.ObjectId|string)=>{
    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
       return false;
    }
    return true;
}

const checkInValidEmail = (email:String) =>{
return true
}
const checkInValidPhoneNum = (phoneNum: string): boolean => {
  const phoneRegex = /^[+]?[1-9][0-9]{1,14}$/;
  return phoneRegex.test(phoneNum);
}


 export {sendResponse,throwError,checkInValidPhoneNum, checkInValidNumberField, checkValidMongoseId, checkInValidStringField,checkInValidEmail};