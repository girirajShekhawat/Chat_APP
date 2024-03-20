import mongoose from "mongoose";
import Chat from "../models/chat.model";
import User from "../models/user.model";


// accessing the chat for the particular user 

const assessChat= async function(req,res){
  try {
    
    const {userId}=req.body;

    if(!userId){
        console.log("userid is not present")
  return res.status(400).json({
    msg:"userId is not present"
  })
    }

    let isChat =await Chat.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch: {$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userId}}}
        ]
    }).populate("users","-password")
     .populate("latestMessage");

     isChat=await User.populate("isChat",{
        path:"latestMessage.sender",
        select:"name email avatar"
     })

     if(isChat.length>0){
     res.send(isChat[0])
     }else{
        //creating the new chat 
        var chatData={
           chatName:"Chat",
            isGroupChat:false,
            users:[req.user._id,userId],
        }
     }

     const newChat=await Chat.create(chatData);
     const chat =await Chat.findOne({_id:newChat._id}).populate("users",
       "-password")

    if(chat){
        res.status(200).json({
            msg:"new chat is created with this user",
            chat
        })
    }
    

  } catch (error) {
    console.log("this error is from the accessChat controler",error.message);
    res.status(500).json({
        msg:error.message
    })
  }
}


export {
    assessChat,

}