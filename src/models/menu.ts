import mongoose, { Schema } from 'mongoose'
import { IMenuItem } from '../interface/MenuInterface';

// Define MenuItem Schema
const menuItemSchema: Schema = new mongoose.Schema<IMenuItem>(
    {
        restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: mongoose.Schema.Types.ObjectId,ref:'Category', required: true },
        image_url: { type: String, required: false },
        available: { type: Boolean, default: true },
        vegMeal:{type:Boolean,required:true},
        isActive: {type: Boolean, default:true}
    },
    { timestamps: true }
);

// Create and export the MenuItem model
const MenuModel = mongoose.model<IMenuItem>('MenuItem', menuItemSchema);

export default MenuModel;