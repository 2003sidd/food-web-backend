import mongoose, { Schema, Document } from 'mongoose';
import IRestaurant from '../interface/ResturantInterface'

// Define the Restaurant schema
const restaurantSchema: Schema = new mongoose.Schema<IRestaurant>(
    {
        name: { type: String, required: true },
        address: { type: String, required: true },
        phone_number: { type: String, required: true },
        // opening_hours: {
        //     monday: { type: String, required: true },
        //     tuesday: { type: String, required: true },
        //     wednesday: { type: String, required: true },
        //     thursday: { type: String, required: true },
        //     friday: { type: String, required: true },
        //     saturday: { type: String, required: true },
        //     sunday: { type: String, required: true },
        // },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);

// Create and export the Restaurant model
const RestaurantModel = mongoose.model<IRestaurant>('Restaurant', restaurantSchema);

export default RestaurantModel;
