import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles.js";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import config from "../config/index.config.js";
import crypto from "crypto";



const userSchema=new mongoose.Schema({
    name:{
        type: String,
        required:true,
        trim:true,
        maxLength:[30,"Username can't be more than of 30 characeters"]
    },
    postcount:{
        type:Number,
        default:0
    },
    password:{
        type:String,
        required:[true,"password is mandatory"],
        select: false,
        minLength:[8,"password must be of 8 characters"]
    },
    email:{
        type:String,
        required:[true,"email is mandatory"]
    },
    roles:{
        type:String,
        enum:Object.values(AuthRoles),
        default:AuthRoles.USER
    },
    followerCount: Number,
    followingCount: Number,
    forgotPasswordToken:String,
    forgotPasswordExpiry:Date,
    
    isVerified:{
        type:Boolean,
        default: false
    },
    verificationToken :String,
    verificationExpiry: Date
},{timestamps:true});

userSchema.pre('save',async function(next){
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,8);
    next()
});

userSchema.methods.comparePassword=async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
};

userSchema.methods.getJWTtoken=function(){
    return JWT.sign({_id:this._id,role:this.roles},config.JWT_SECRET_KEY,{expiresIn: config.JWT_EXPIRY});
};

userSchema.methods.generateForgotPasswordToken=function(){
    const forgotToken=crypto.randomBytes(10).toString("hex");

    this.forgotPasswordToken=crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex")


    this.forgotPasswordExpiry=Date.now()+10*60*1000;

    return forgotToken;
}


export default mongoose.model("User",userSchema);