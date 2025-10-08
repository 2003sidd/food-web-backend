import mongoose from "mongoose"

export interface IMenuItem extends Document {
  _id:string
  restaurant_id: mongoose.Schema.Types.ObjectId; // Reference to the restaurant
  name: string;
  description: string;
  price: number;
  category: mongoose.Schema.Types.ObjectId;
  image_url: string;
  available: boolean;
  vegMeal:boolean
  isActive:boolean
}