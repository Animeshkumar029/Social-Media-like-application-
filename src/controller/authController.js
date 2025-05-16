import userSchema from "../model/user.schema.js";
import customError from "../utils/customError.js";
import asyncHandler from "../services/asyncHandler.js";
import cookieOptions from "../utils/cookieOptions.js";
import { mailFunction } from "../services/mailer.js";



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

    await mailFunction(email,
        "Signup Successful",
        "Welcome to Our website, thankyou for signing-up here"
    )

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

    const iscorrect=await user.comparePassword(password);
    if(!iscorrect) throw new customError("Wrong Password",400);

    const token=user.getJWTtoken();
    res.cookie("token",token,cookieOptions);

    await mailFunction(email,
        "Login confirmation mail",
        "You have logged-in to our website with this email, welcome back"
    )

    return res.status(200).json({
        success:true,
        message:"user logged in sucessfully",
        token,
        user
    })
})

export const logout=asyncHandler(async(req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly: true
    })

    await mailFunction(req.user.email,
        "Log-out confirmation",
        "User logged-out successfully, hope to see to you soon"
    )

    res.status(200).json({
        success:true,
        message:"User logged out"
    })
})


export const forgotPassword=asyncHandler(async(req,res)=>{
    const email=req.body.email;

    if(!email) throw new customError("Invalid email id provided",422);

    const user=await userSchema.findOne({email});

    if(!user) throw new customError("User not found",422);

    const forgotToken=user.generateForgotPasswordToken();

    await user.save({validateBeforeSave:false});

    const reseturl=`${req.protocol}://${req.get('host')}/api/v1/auth/password/reset/${forgotToken}`;

    const message=`You have requested to reset your password, here is the link for that \n\n ${reseturl} \n\n IGNORE IF YOU DID NOT REQUESTED THIS`;

    try{
        await mailFunction(email,
        "Forgot password and reset request",
        message
    )
    }catch(error){
        user.forgotPasswordToken=undefined;
        user.forgotPasswordExpiry=undefined;
        await user.save({validateBeforeSave:false})

        throw new customError("Mail sending failed", 500);
    }
})


export const resetpassword=asyncHandler(async(req,res)=>{

    const checkToken=crypto
                     .createHash("sha256")
                     .update(req.params.forgotToken)
                     .digest("hex")

    const user=await userSchema.findOne({
        forgotPasswordToken: checkToken,
        forgotPasswordExpiry: {$gt: Date.now()}
    })                

    if(!user) throw new customError("Invalid request",404);

    const password=req.body.password;
    const confirmPassword=req.body.confirmPassword;

    if(!password || !confirmPassword || password!==confirmPassword) throw new customError("Either password or confirm password is missing or they do not match",422);

    user.password=password;
    user.forgotPasswordExpiry=undefined;
    user.forgotPasswordToken=undefined;
    
    await user.save({validateBeforeSave:true});

    res.status(200).json({
        success:true,
        message:"Password reset successfully"
    })
})