import { Router } from "express";
import { signupUser, userLogin, userLogout,searchUser} from "../controllers/user.controller.js";
import upload from "../middleware/multer.middleware.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
const userRouter=Router();

userRouter.route('/signup').post(upload.fields([{
name: "avatar" , maxCount:1
}]), signupUser);

userRouter.route("/signin").post(userLogin)

// secured routes
userRouter.route("/logout").post(verifyJwt,userLogout)
userRouter.route("/").get(verifyJwt,searchUser)


export default  userRouter;