import { Document, Types } from "mongoose";

export interface IAddressModal extends Document {
    street: string;
    city: string;
    state: string;
    country: string;
    userId: Types.ObjectId; 
    isActive: boolean
}