import { Router } from "express";
import { fetchMessage,createMessage } from "../controllers/message.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
const messageRouter=Router();

messageRouter.route("/:chatId").get(verifyJwt,fetchMessage)
messageRouter.route("/create").post(verifyJwt,createMessage)


export default messageRouter;