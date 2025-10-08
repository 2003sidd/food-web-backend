import mongoose from "mongoose";

export default interface IWishlist {
    _id:mongoose.Types.ObjectId,
    userId:mongoose.Types.ObjectId,
    menuId:mongoose.Types.ObjectId,
    createdBy:string,
    updatedOn:string,
}