import { Router } from "express";
import { fetchMessage,createMessage } from "../controllers/message.controller";
import { verifyJwt } from "../middleware/auth.middleware";
const messageRouter=Router();

messageRouter.route("/:chatId").get(verifyJwt,fetchMessage)
messageRouter.route("/create").post(verifyJwt,createMessage)


export default messageRouter;