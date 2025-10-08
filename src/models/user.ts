import mongoose, { Schema } from "mongoose";
import IUser from "../interface/UserInterface";
import { RoleTypeEnum } from "../enum/RoleTypeEnum";
import bcrypt from "bcrypt";
import logger from "../utility/wingstonLogger";



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



userSchema.methods.comparePassword = async function (password:string) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.error("Error comparing password:", error);
    return false; // Return false on error to avoid potential leaks
  }
};

userSchema.pre('save',async function (next) {
    if(!this.isModified('password')){
        return next();
    };

    try {
         this.password = await bcrypt.hash(this.password as string, 10); // Use a cost factor of at least 10
    next();
        
    } catch (error) {
         logger.error("Error hashing password:", error);
      next(error instanceof Error ? error : new Error("An unknown error occurred while hashing the password"));

    }
})



// Create and export the user model
const UserModel = mongoose.model<IUser>('User', userSchema);

export default UserModel;
