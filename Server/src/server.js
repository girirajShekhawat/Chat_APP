import express from "express";
import router from "./routes/index.routes.js"
import cookieParser from "cookie-parser" 
 import cors from "cors"

const app=express();
app.use(cors())
app.use(express.json())

app.use(express.urlencoded({
 extended:true,
 limit:"16kb"}
 ))

 app.use(express.static("public"));
 
 app.use(cookieParser());
 
// route declaration
app.use("/",router)
 

export default app;


