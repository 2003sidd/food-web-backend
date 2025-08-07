import { timeStamp } from "console"
import mongoose, {Document} from "mongoose"

export default interface ICart extends Document{
 userId :mongoose.Types.ObjectId,
 menuId :mongoose.Types.ObjectId,
 quantity:number
};