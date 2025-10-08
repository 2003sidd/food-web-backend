import mongoose, { Schema } from "mongoose"
import ICart from "../interface/cartInterface";

const cartSchema: Schema = new mongoose.Schema<ICart>({
    quantity: { type: Number, required: true, min: [1, "Quantity must be atleast 1"] },
    menu: { type: Schema.Types.ObjectId, ref: "MenuItem", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

},
    { timestamps: true });

// Add an index for userId and menuId for optimization if you frequently query by these
cartSchema.index({ userId: 1, menuId: 1 });

const cartModel = mongoose.model<ICart>("Cart", cartSchema);
export default cartModel;





