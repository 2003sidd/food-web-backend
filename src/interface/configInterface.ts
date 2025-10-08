import { Document } from "mongoose";

export interface IConfig extends Document {
     paymentModes: String[],
    freeDeliveryThreshold: number,
    deliveryCharge: number,
    platformFee:number,
    isFreeDeliveryEnabled: Boolean,
    maintenanceMode: boolean,
}

