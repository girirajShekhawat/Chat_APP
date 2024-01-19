import "dotenv/config"
import app from "./server.js"
import connectDb from "./db/index.js";

const port=process.env.PORT||8000;


connectDb().then(()=>{
    app.listen(port,()=>{
        console.log(`Server is up and running the port ${port}`)
    })
}).catch((Error)=>{
    console.log("Error in server=",Error)
})
 