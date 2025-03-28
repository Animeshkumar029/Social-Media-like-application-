import userSchema from "../model/user.schema.js";
import asyncHandler from "../services/asyncHandler.js";
import customError from "../utils/customError.js";
import JWT from "jsonwebtoken";
import config from "../config/index.config.js";

export const isLoggedin=asyncHandler(async(req,res,next)=>{
    let token;
    if(req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))){
        token=req.cookies.token||req.headers.authorization.split(" ")[1];
    }
    if(!token) throw new customError("Authorization not granted",400);

    try{
        const decodedJWTpayload=JWT.verify(token,config.JWT_SECRET_KEY);
        req.user=await userSchema.findById(decodedJWTpayload._id,"name email roles")
        next()
    }catch(error){
        throw new customError("unauthorized",400);
    }
})

export const authorize=(...requiredRoles)=>asyncHandler(async(req,res,next)=> {
    if(!requiredRoles.includes(req.user.role)) throw new customError("You are not authorized to access this resource",400);
    next()
})
