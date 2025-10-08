import { Document, Types } from "mongoose";

export interface IAddressModal extends Document {
    address: string;
    city: string;
    name:string;
    number:string;
    state: string;
    country: string;
    userId: Types.ObjectId; 
    isActive: boolean
}