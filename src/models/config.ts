import mongoose from "mongoose";
import { IConfig } from "../interface/configInterface";

// Sub-schema for payment modes
const paymentSchema = new mongoose.Schema({
    COD: { type: Boolean, default: true },
    Card: { type: Boolean, default: false },
    UPI: { type: Boolean, default: false }
}, { _id: false }); // No _id for embedded schema

// Main config schema
const configSchema = new mongoose.Schema<IConfig>({
    paymentModes:[ {
        type: String,
        required:true  // Ensures defaults from sub-schema are used
    }],
    freeDeliveryThreshold: {
        type: Number,
        default: 500
    },
    deliveryCharge: {
        type: Number,
        default: 40
    },
    platformFee:{
         type: Number,
        default: 0  
    },
    isFreeDeliveryEnabled: {
        type: Boolean,
        default: true
    },
    maintenanceMode: {
        type: Boolean,
        default: false
    },
},{timestamps:true});

// // Optional: Force a single config document using a fixed _id
// configSchema.statics.getSingleton = function () {
//     return this.findById("config");
// };

const ConfigModel = mongoose.model("Config", configSchema);
export default ConfigModel;