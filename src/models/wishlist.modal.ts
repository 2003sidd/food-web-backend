import mongoose from "mongoose";
import IWishlist from "../interface/Wishlist.interface";

const WishlistSchema = new mongoose.Schema({
    
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User"
    },
    menuId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "MenuItem"
    }
}, { timestamps: true });

const WishlistModel = mongoose.model("Wishlist", WishlistSchema);
export default WishlistModel; 