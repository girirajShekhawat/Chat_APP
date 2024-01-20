import { Router } from "express";
import { registration } from "../controllers/user.controller.js";
const userRoute=Router();

userRoute.route('/registration').get(registration)




export default  userRoute;