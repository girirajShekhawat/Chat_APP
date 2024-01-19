import mongoose from "mongoose";
import { DbName } from "../constants.js";

async function connectDb(){
try {
    const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DbName}`);
    console.log("connected with the DB");

} catch (error) {
    console.log("!!Connection with DB is failed",error)
}
}

export default connectDb;