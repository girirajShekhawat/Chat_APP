import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Chat from "../models/chat.model.js";


//create the new massage;

const createMessage=async function(req,res){
    try {
        const{chatId, content}=req.body
    
        if(!chatId || !content){
            res.status(400).json({
                msg:"chatId or content is not present"
            })
        }
    
        let newMessage={
            sender:req.user._id,
            content:content,
            chat:chatId
        }
    
        const createMessage=await Message.create(newMessage);
         
      await createMessage.populate("sender","name avatar email")
       .populate("chat");
    
       await createMessage.populate({
        path:"chat.users",
        select:"name avatar email"
       })
    
       await Chat.findByIdAndUpdate(
        chatId,
        {
            latestMessage:content
        },
        {
            new:true
        }
       )
    
       res.status(200).json({
        msg:"message sended successfully",
        message
       })
    } catch (error) {
        console.log("this error is coming from the message model",error.message)
        res.status(500).json({
            msg:error.message
        })
    }
                                
}

// fetching all the messages 

const fetchMessage= async function(req,res){

  try {
      const {chatId}=req.params;
      
      if(!chatId){
      res.status(404).json({
          msg:"chatId is not present"
      })
      }
  
   const message= await Message.find({chat:chatId})
                      .populate("sender","name avatar")
                      .populate("chat");
  
    if(!message){
      res.status(404).json({
          msg:"message fetching is failed"
      })
    }
  } catch (error) {
    res.status(500).json({
        msg:error.message
    })
  }
                    
}        

export{
    createMessage,
    fetchMessage
}