import jwt from "jsonwebtoken"
import User from "../models/user.model.js";

export const verifyJwt=async function(req,res,next){

    try {
        const token= req.cookies?.accessToken || req.header.
        Authorization ?.replace("Bearer ","")
          // ("Authorization")?.replace("Bearer ","")

                 if(!token){
            return res.status(401).json({
                msg:"token is not present"
            })
        }
    // decode the token
     
    const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    const user=await User.findById(decodedToken?._id).select("-password -refreshToken");
    
    if(!user){
        res.status(401).json({
            msg:"user is not authenticated"
        })
    }
    //now set a new field in req named user and set the value of this new field user  
     req.user=user;
     next() 
    } catch (error) {
      return  res.status(500).json({
            msg:"something went wrong at authentication",
             error:error.message
        })
    }  
}