import mongoose, { mongo } from "mongoose";
import { IAddressModal } from "../interface/AddressModal";

const addressSchema = new mongoose.Schema<IAddressModal>({
    street: {
        required: true,
        type: String
    },
    city: {
        required: true,
        type: String,
    },
    state: {
        required: true,
        type: String,
    },
    country: {
        required: true,
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isActive: { type: Boolean, default: true }
});

const addressModal = mongoose.model<IAddressModal>("Address", addressSchema);
export default addressModal;