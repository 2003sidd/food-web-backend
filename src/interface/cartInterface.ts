import { timeStamp } from "console"
import mongoose, {Document, Types} from "mongoose"
import { IMenuItem } from "./MenuInterface";

export default interface ICart extends Document{
 userId :mongoose.Types.ObjectId,
 menu :IMenuItem | Types.ObjectId,
 quantity:number
};