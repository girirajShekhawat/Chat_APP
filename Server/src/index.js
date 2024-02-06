import "dotenv/config"
 import { httpServer,io } from "./chatServer.js";
import connectDb from "./db/index.js";
import { Socket } from "socket.io";

const port=process.env.PORT||8000;

io.on("connection",(socket)=>{
    console.log("new socket connection is built",socket.id)
})


connectDb().then(()=>{
    httpServer.listen(port,()=>{
        console.log(`Server is up and running the port ${port}`)
    })
}).catch((Error)=>{
    console.log("Error in server=",Error)
})
 