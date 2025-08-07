import express from "express";
import { login, Resgister } from "../controller/user.controller";
const router = express.Router();


router.route("/login").post(login);
router.route("/register").post(Resgister)

export default router