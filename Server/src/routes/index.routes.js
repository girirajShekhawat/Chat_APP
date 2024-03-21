 import { Router } from "express";
 import userRouter from "./user.routes.js";
 import chatRouter from "./chat.routes.js";
 import messageRouter from "./message.route.js";
 const router=Router();

 router.use("/api/v1/user",userRouter);
 router.use("/api/v1/chat", chatRouter);
 router.use("/api/v1/message",messageRouter)

 export default router;