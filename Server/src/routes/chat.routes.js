import { Router } from "express";
import {  assessChat, fetchAllChats,createGroupChat,renameGroup,removeTheUser,addingTheUser, } from "../controllers/chat.controller";
import { verifyJwt } from "../middleware/auth.middleware";
const chatRouter=Router();



chatRouter.route("/").post(verifyJwt,assessChat);
chatRouter.route("/getChats").get(verifyJwt, fetchAllChats);
chatRouter.route("/createGroup").post(verifyJwt,createGroupChat);
chatRouter.route("/rename").put(verifyJwt,renameGroup);
chatRouter.route("/remove").put(verifyJwt,removeTheUser);
chatRouter.route("/addUser").put(verifyJwt,addingTheUser);


export default chatRouter;
