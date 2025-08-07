import mongoose, { Schema } from "mongoose";
import IUser from "../interface/UserInterface";
import { RoleTypeEnum } from "../enum/RoleTypeEnum";

const userSchema: Schema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    phoneNo: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    cartCount: { type: Number, default: 0 },
    role:{
        type: String,
        enum: Object.values(RoleTypeEnum),
      default:RoleTypeEnum.User
    },
    isActive: { type: Boolean, default: true }
},
    { timestamps: true }
);


// Create and export the user model
const UserModel = mongoose.model<IUser>('User', userSchema);

export default UserModel;
