import User from "../models/user.model.js"
import uploadOnCloud from "../utils/cloudineary.js";


export const signupUser= async function(req,res){


try {
    
    const{username,name,email,password,avatar}=req.body;
    console.log(req.body,username)
   // checking for all the fields availability
   if(!username||!name||!email||!password){
       return res.status(404).json({
           msg:"all the fields are not filled"
       })
   }

   // check whether username and email is register already 

   const isAlreadyRegister=await User.findOne({
       $or:[{username},{email}]
   })
 
   console.log(isAlreadyRegister);

   if(isAlreadyRegister){
       return res.status(404).json({
           msg:"user is already register already"
       })
   }
 
   // checking whether img file is uploaded or not
   let avatarUrl;
   const avatarObj=Object.keys(req.files).length
 
   if(avatarObj){
   const filePath=req.files?.avatar[0]?.path;

   // if(!filePath){
   //     return res.status(400).json({
   //         msg:"avatar img upload failed"
   //     })
   // }
     avatarUrl=  await uploadOnCloud(filePath);
   }
   // if(!avatarUrl){
   //     return res.status(400).json({
   //         msg:"avatar img upload failed"
   //     })
   // }

   const user={
       username,
       name,
       email,
       password,
       avatar:avatarUrl || "",
       }

const userCreate= await User.create(user);    
 
if(userCreate){
   userCreate.password=undefined;
   userCreate.refreshToken=undefined;
   console.log(userCreate)
   return    res.status(200).json({
       msg:"user is get registered",
       user:userCreate
   })
}

} catch (error) {
    console.log("error in user registration",error)
    return    res.status(400).json({
        msg:"user not registered",
        error 
    }) 
} 
}