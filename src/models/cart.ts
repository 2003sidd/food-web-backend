import mongoose, { Schema } from "mongoose"
import ICart from "../interface/cartInterface";

const cartSchema: Schema = new mongoose.Schema<ICart>({
    quantity: { type: Number, required: true },
    menuId: { type: Schema.Types.ObjectId, required: true },
    userId: { type: Schema.Types.ObjectId, required: true },

},
    { timestamps: true });

const cartModel = mongoose.model<ICart>("Cart", cartSchema);
export default cartModel;





