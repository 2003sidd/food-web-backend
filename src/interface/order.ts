import mongoose, { Document, Double } from "mongoose";



// Define interface for individual order items
export interface IOrderItem {
  menu: mongoose.Types.ObjectId;
  price: number;
  quantity: number;
}

export default interface IOrder extends Document {
  orderId: mongoose.Types.ObjectId; // Order ID
  userId: mongoose.Types.ObjectId; // User ID (referencing the User model)
  totalPrice: number; // Total price of the order (number type for price)
  items: IOrderItem[];
  status: String;
  address: mongoose.Types.ObjectId,
  paymentMode: String
  platformFee: number,
  deliveryCharge: number
}