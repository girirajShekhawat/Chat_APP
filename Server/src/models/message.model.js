import mongoose from "mongoose";


const messageSchema= new mongoose.Schema({
Content:{
    type:String,
    required:true,
},
sender:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
},
chat:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Chat"
},
readBy:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
}]


},{
    timestamps:true,
})

const Message=mongoose.model("Message",messageSchema);

export default Message;