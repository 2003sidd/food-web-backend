import mongosse, { mongo, Mongoose } from "mongoose";
import { ICategoryModal } from "../interface/CategoryModal";

const categorySchema = new mongosse.Schema<ICategoryModal>({
    name: {
        required: true,
        type: String,
    },
    image: {
        required: false,
        type: String,
    },
    isBlocked: {
        required: true,
        type: Boolean,
        default: false
    },
    isActive: {type: Boolean, default:true}
});

const categoryModel = mongosse.model<ICategoryModal>("Category", categorySchema);
export default categoryModel;
