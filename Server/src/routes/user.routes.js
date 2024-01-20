import { Router } from "express";
import { signupUser } from "../controllers/user.controller.js";
import upload from "../middleware/multer.middleware.js";
const userRoute=Router();

userRoute.route('/signup').post(upload.fields([{
name: "avatar" , maxCount:1
}]), signupUser)




export default  userRoute;