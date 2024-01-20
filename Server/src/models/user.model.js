import mongoose from "mongoose";
import bcrypt from "bcrypt"

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


const User=mongoose.model("User",userSchema);
export default User;