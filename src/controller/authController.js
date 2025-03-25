import userSchema from "../model/user.schema.js";
import customError from "../utils/customError.js";
import asyncHandler from "../services/asyncHandler.js";
import cookieOptions from "../utils/cookieOptions.js";



export const signup=asyncHandler(async (req,res)=>{
    let name=req.body.name;
    let password=req.body.password;
    let email=req.body.email;

    if(!name||!password||!email) throw new customError("FillUp all the feilds",400);

    const isExisting=await userSchema.findOne({email});
    if(isExisting) throw new customError("User already exists",400);

    const user=await userSchema.create({name,password,email});

    const token=user.getJWTtoken();

    user.password=undefined;

    res.cookie("token",token,cookieOptions);

    res.status(200).json({
        success:true,
        message: "user created successfully",
        user,
        token
    })
})

export const login=asyncHandler(async(req,res)=>{
    let email=req.body.email;
    let password=req.body.password;

    if(!email||!password) throw  new customError("FillUp all credentials",400);

    const isuser=await userSchema.findOne({email});
    if(!isuser) throw new customError("No User found",400);

    const user=await userSchema.findOne({email}).select("+password");

    if(!user) throw new customError("Invalid credentials",400);

    const iscorrect=await userSchema.comparePassword(password);
    if(!iscorrect) throw new customError("Wrong Password",400);

    const token=user.getJWTtoken();
    res.cookie("token",token,cookieOptions);

    return res.status(200).json({
        success:true,
        message:"user logged in sucessfully",
        token,
        user
    })
})

export const logout=asyncHandler(async(req,res)=>{
    req.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success:true,
        message:"User logged out"
    })
})