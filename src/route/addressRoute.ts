import express from "express"
import { addAddress, deleteAddress, getAddresses } from "../controller/address.controller"
import { upload } from "../utility/Multer"
const addressRoute = express.Router()

addressRoute.post("/addAddress", addAddress)
addressRoute.get("/getAddress", getAddresses)
addressRoute.delete("/deleteAddress", deleteAddress)

export default addressRoute