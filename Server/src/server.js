import express from "express";
import router from "./routes/index.routes.js"
 
const app=express();


 
// route declaration
app.use("/",router)
 

export default app;


