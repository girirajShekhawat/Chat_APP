import { Router } from "express";
import { signupUser, userLogin } from "../controllers/user.controller.js";
import upload from "../middleware/multer.middleware.js";
const userRoute=Router();

userRoute.route('/signup').post(upload.fields([{
name: "avatar" , maxCount:1
}]), signupUser);

userRoute.route("/signin").post(userLogin)




export default  userRoute;