import User from "../models/user.model.js"
import uploadOnCloud from "../utils/cloudineary.js";


const generateAccessAndRefreshToken= async function(userId){
    
       try {
        const user=await User.findById(userId);
        if(!user){
        //  return res.status(400).json({
        //      msg:"Error in Token generation"
        //   })
        return 
        }
     const accessToken=await user.generateAccessToken();
     const refreshToken=await user.generateRefreshToken();
    // now save the refresh token in the db

      user.refreshToken=refreshToken;
      await user.save({validateBeforeSave:false});

      return{ accessToken,refreshToken}

       } catch (error) {
        console.log(error)
    return
       }
  }

//controller for registering the user
export const signupUser= async function(req,res){

try {
    
    const{username,name,email,password,avatar}=req.body;
    console.log(req.body)
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
   
 
   if(req.files && Array.isArray(req.files.avatar) && req.files.avatar.length>0){

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
       avatar:avatarUrl || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
       }

const userCreate= await User.create(user);    
 
if(userCreate){
   userCreate.password=undefined;
   userCreate.refreshToken=undefined;
   console.log(userCreate)
   return    res.status(200).json({
       msg:"user is get registered",
       data:userCreate,
       success:true
   })
}

} catch (error) {
    console.log("error in user registration",error.message)
    return    res.status(400).json({
        msg:"user not registered",
        error:error.message
    }) 
} 
}


//  for login controller
export const userLogin= async function(req,res){

try {
    const{password,email,username}=req.body;
  console.log(req.body)
    if(!username && !email){
        return res.status(404).json({
            msg:"username or email required"
        })}
 
    if(!password){
    return res.status(404).json({
        msg:"password is required"
    })}

    // check wheter user is presente or not 
    const user=await User.findOne({
        $or:[{email},{username}]
    });
 
    if(!user){
        return res.status(404).json({
            msg:"User is not exist"
        })
    }
   
  const isPasswordValid= await user.isPasswordCorrect(password);
   
    if (!isPasswordValid) {
        return res.status(401).json({
        msg: "Incorrect password"
       });
        }

  const{refreshToken,accessToken} = await generateAccessAndRefreshToken(user._id);
  
//   setting up the password and refresh token empty before sending the data in response
    user.refreshToken="";   
    user.password="";

// setting up the option field for the cookies
  const options={
    httpOnly:true,
    secure:true,
  }
 
return res.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",refreshToken,options)
.json({
    msg:"user loged in successfully",
    data:{
        user,accessToken,refreshToken  // we are sending tokens explisitly because if user want to store token in local storage
    },
    success:true
}) 
} catch (error) {
   console.log("Login failed",error)
   return res.status(500).json({
    msg:"some thing went wrong",
    error
   }) 
}
}

// for the user logout 

export const userLogout= async function(req,res){
  
   try {
   const response=  await User.findByIdAndUpdate(
         req.user._id,
         {
           $unset:{ refreshToken:1}  
         },
         {
             new:true,
         })

    const options={
        httpOnly:true,
        secure:true,
      }

    return  res.status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken",options)
      .json({
        msg:"user logout successfully",
        success:true
      })

   } catch (error) {
    return res.status(500).json({
        msg:"some thing went wrong",
        error:error.message
       }) 
   }
}

// password updated controller
export const changePassword=async function (req,res){
    try {
        const{oldPassword,newPassword}=req.body;

        if(!oldPassword || !newPassword){
            return res.status(400).json({
                msg:"password not found"
            })
        }
    const user=await User.findById(req.user?._id);

    const isPasswordCorrect=await user.isPasswordCorrect(oldPassword);

    if(!isPasswordCorrect){
        return res.status(400).json({
             msg:"old password is not correct"
        })
    }

    user.password=newPassword;
      await user.save({validateBeforeSave:false});
   
      return res.status(200).json({
                 msg:"password updation  successful",
                 success:true
                 
             })

    } catch (error) {
        return res.status(500).json({
            msg:"some thing went wrong in password updation",
            error:error.message
        })
    }
}

// fetching the current user
export const getCurrentUser= async function(req,res){
    try {
        res.status(200).json({
            data:req.user,
            msg:"user fetching successfull",
            success:true
        })
    } catch (error) {
        return res.status(500).json({
            msg:"some thing went wrong user fetching",
            error:error.message
        })
    }
}

// user datailes update
export const userDetailsUpdate= async function(req,res){
    try {
         const {email,name}=req.body;

         if(!email|| !name){
            return res.status(400).json({
                msg:"name or email is not found",
            })
         }

   const user=await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set:{
                    email,
                    name
                }
            },
            {
                new:true
            }
         ).select("-password -refreshToken");

        if(!user){
            return res.status(400).json({
                msg:"user datails updation failed",
        })} 

        return res.status(200).json({
            msg:"user datails updated successfully",
            success:true,
        })

    } catch (error) {
        return res.status(500).json({
            msg:"some thing went wrong in user updation",
            error:error.message
        })
    }
}

// updating the avatar image 

export const updateAvatar= async function(req,res){
    try {
      const{avatarpath}=req.file?.path;
    
      if(!avatarpath){
        return res.status(400).json({
            msg:"avatar file is not present",
        })
      }

  const avatarUrl= await uploadOnCloud(avatarpath);

  if(!avatarUrl){
    return res.status(400).json({
        msg:"avatar file is not uploaded on the cloudineary",
    })
  }

  const user=await User.findByIdAndUpdate(
     req.user?._id,
     {
        $set:{
            avatar:avatarUrl
        }
     },
     {
        new:true
     }
  ).select("-password -refreshToken");
  
  if(!user){
    return res.status(400).json({
        msg:" avatar updatedation failed ",
})} 

return res.status(200).json({
    msg:"avatar updated successfully",
    success:true
})
    } catch (error) {
        return res.status(500).json({
            msg:"some thing went wrong in avatar updation",
            error:error.message
        })
    }
}

//search for the users 

export const searchUser=async function(req,res){
  try {
      const keyword=req.query.search ?
      {$or:[
        {name:{$regex:req.query.search,$options:"i"}},
        {email:{$regex:req.query.search,$options:"i"}},
        {username:{$regex:req.query.search,$options:"i"}},
        
      ]} : {}
  
      const search=await User.find(keyword).find({_id:{$ne:req.user._id}}).select("-password")
      
      if(!search){
          res.status(404).json({
              msg:"searching got failed"
          })
      }
      
      res.status(200).json({
          msg:"searching is successfull",
          data:{
            users:search,
          },
          success:true
      })
  
  } catch (error) {
    return res.status(500).json({
        msg:"some thing went wrong in searching the user",
        error:error.message
    })
  }
}


 



 