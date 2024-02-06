import {createServer} from "http";
import {Server} from "socket.io";
import app from "./server.js";

const httpServer=createServer(app);
const io=new Server (httpServer)




export {
    httpServer,
    io
}