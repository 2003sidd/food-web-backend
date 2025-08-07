import { Document } from "mongoose";

export interface ICategoryModal extends Document {
    name: string;
    image: string;
    isBlocked: boolean;
    isActive: boolean
}