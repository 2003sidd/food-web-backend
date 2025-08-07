import mongoose, {Document, Double} from "mongoose";
  

    
// Define interface for individual order items
export interface IOrderItem {
  menuId: mongoose.Types.ObjectId;
  restaurantName: string;
  price: number;
  quantity: number;
}

export default interface IOrder extends Document {
  orderId: mongoose.Types.ObjectId; // Order ID
  userId: mongoose.Types.ObjectId; // User ID (referencing the User model)
  totalPrice: number; // Total price of the order (number type for price)
  items: IOrderItem[];
  status:String;
  paymentMode:String
}