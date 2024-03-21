import mongoose from "mongoose";
import Chat from "../models/chat.model";
import User from "../models/user.model";


// accessing the one to one chat of the user if it is not present there then create a new chat  

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


// fetching all the chats for the loged in user 

const fetchAllChats= async function(req,res){

  try {
    const  chat= await Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
                 .populate("users","-password")
                 .populate("groupAdmin","-password")
                 .populate("latestMessage")
                 .sort({updatedAt:-1})
                 .then(async (result)=>{
                   result=await User.populate(result,{
                    path:"latestMessage.sender",
                    select:"name email avatar"
                   })
                 })

             if(!chat){
              res.status(400).json({
                msg:"Error in fetching the chats",
              })
             }    

             res.status(200).json({
              msg:"all chats are fetched successfully",
              chat
            })
  } catch (error) {
    console.log("error is from the fetch all the chats controller",error.message);
    res.status(500).json({
      msg:error.message
    })
  }
}


// create group chat 

const createGroupChat= async function(req,res){
  try {
    if((!req.body.user)||(!req.body.name)){
    res.status(400).json({
       msg:"group name or users both should be present"
      })
    }

    let groupMembers=req.body.user
    groupMembers.push(req.user)

    if(groupMembers.length<3){
      res.status(400).json({
        msg:"group member should be more than 2"
      })
    }

    const group=await Chat.create({
      chatName:req.body.name,
      users:groupMembers,
      isGroupChat:true,
      groupAdmin:req.user
    })
   const accessTheGroup= await Chat.findById({_id:group._id})
                                   .populate("users", "-password")
                                   .populate("groupAdmin","-password")
     
     res.status(200).json({
      msg: "new group formation is successfully",
      group:accessTheGroup
     })
 

  } catch (error) {
    console.log("error in making the group",error.message)
    res.status(500).json({
      msg:error.message
    })
  }
}


//Rename the group 

const renameGroup=async function(req,res){
  try {
    const {chatId,chatName}=req.body;

    if(!chatId || !chatName){
    req.status(400).json({
      msg:"chatId or chatName is required"
    })
    }

    const updatedName= await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName:chatName,
      },
       {
        new:true
       }
    ).populate("users","-password")
     .populate("groupAdmin","-password")

    if(!updatedName){
      res.status(400).json({
        msg:"updating the name is failed"
      })
    }

    res.status(200).json({
      msg:"name updation successfull"
    })

  } catch (error) {
    console.log("Error is from the groupRename controller", error.message);
    res.status(500).json({
      msg:error.message
    })
  }
}

//Removing the user from the group

const removeTheUser= async function(req,res){
   
 try {
   const {userId,chatId}=req.body
 
   if(!userId || !chatId){
     res.status(404).json({
       msg:"userId or chatId is not present"
     })
   }
 
   const removeUser= await Chat.findByIdAndUpdate(
        chatId,
        {
         $pull:{users:userId}
        },
        {
         new:true
        }
   ).populate("users","-password")
    .populate("groupAdmin","-password")
   if(!removeUser){
     res.status(404).json({
       msg:"user remove failed"
     })
   }
   
   res.status(200).json({
     msg:"user is removed successfully",
     chat:removeUser
   })
 
 } catch (error) {
  console.log("Error is from the  removing the user controller", error.message);
  res.status(500).json({
    msg:error.message
  })
 }
}

//Adding the new user in the group

const addingTheUser=async function(req,res){
 try {
   const {chatId,userId}=req.body
 
   if(!chatId || !userId){
     res.status(400).json({
       msg:"chatId or userId is not present"
     })
   }
   
   const addUser=await Chat.findByIdAndUpdate(
     chatId,
     {
       $push:{users:userId}
     },
     {
       new:true
     }
   ).populate("users","-password")
    .populate("groupAdmin","-password")
 
    if(!addUser){
     res.status(404).json({
       msg:"adding the user is failed"
     })
    }
 
    res.status(200).json({
     msg:"user is added in the group successfully",
     chat:addUser
    })
 } catch (error) {
  console.log("Error is from the  adding the user controller", error.message);
  res.status(500).json({
    msg:error.message
  })
 }
}

export {
    assessChat,
    fetchAllChats,
    createGroupChat,
    renameGroup,
    removeTheUser,
    addingTheUser,
}