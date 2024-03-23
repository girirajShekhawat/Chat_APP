import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const userSchema= new mongoose.Schema({
 
    username:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true,
    },
    name:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
        default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        required: true,
    },
    isAdmin:{
        type:Boolean,
        default:false,
        required:true,
    },
    refreshToken:{
        type:String,
    }
    }
    ,{
        timestamps:true

    })

// bycrypting the password
userSchema.pre("save", async function(next){
if(!this.isModified("password")) return next();

 this.password=  await bcrypt.hash(this.password,10);
 next();
})

// decrypting the password
userSchema.methods.isPasswordCorrect= async function(password){
  return  await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
 return   jwt.sign(
    {
        _id:this._id,
        email:this.email,
        username:this.username,
        name:this.name,
    },
  process.env.ACCESS_TOKEN_SECRET,
  {
  expiresIn:process.env.ACCESS_TOKEN_EXPIRY
  }
    )
}

   userSchema.methods.generateRefreshToken=function(){
return    jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
     )
}

const User=mongoose.model("User",userSchema);
export default User;