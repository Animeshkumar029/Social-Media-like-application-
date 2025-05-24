import userSchema from "../model/user.schema.js";
import customError from "../utils/customError.js";
import asyncHandler from "../services/asyncHandler.js";
import cookieOptions from "../utils/cookieOptions.js";
import { mailFunction } from "../services/mailer.js";
import crypto from "crypto";
import { generateUsername } from "../services/username.service.js";

export const signup=asyncHandler(async (req,res)=>{
    let name=req.body.name;
    let password=req.body.password;
    let email=req.body.email;

    if(!name||!password||!email) throw new customError("FillUp all the feilds",400);

    const isExisting=await userSchema.findOne({email});
    if(isExisting) throw new customError("User already exists",400);

    const username=await generateUsername(name);

    const verToken=crypto.randomBytes(12).toString('hex');
    const verTokenExpiry= Date.now()+15*60*1000;

    const user=await userSchema.create({name,username,password,email,
        verificationToken:verToken,
        verificationExpiry:verTokenExpiry
    });

    const verURL=`${req.protocol}://${req.get('host')}/api/v1/auth/verifyEmail/${verToken}?email=${email}`;
    const message=`You have been registered on our site and now verification must be done to proceed further, 
                click on this ${verURL}  url to verify your email.
                Also your unique username is "${username}"  you can also user it to login`;

    await mailFunction(email,"Verify email",message);

    res.status(200).json({
        success:true,
        message: "User registerd successfully and verification mail sent, login either using email or username(provided) again after verification to enter our site"
    })
})

export const verifyEmail=asyncHandler(async(req,res)=>{
    const email=req.query.email;
    const token=req.params.verToken;

    if(!email || !token) throw new customError("Either email or token is missing",400);

    const user=await userSchema.findOne({email:email,verificationToken:token,verificationExpiry:{$gt: Date.now()}});

    if(!user) throw new customError("No such user",422);

    user.isVerified=true;
    user.verificationExpiry=undefined;
    user.verificationToken=undefined;

    await user.save({validateBeforeSave:true});

    await mailFunction(email,
        "Verifiaction Done",
        "Your verification is completed now, login to enter our site"
    )

    res.status(200).json({
        success:true,
        message:"Email Verification completed"
    })

})

export const login=asyncHandler(async(req,res)=>{
    let username=req.body.username;
    let email=req.body.email;
    let password=req.body.password;

    if(!username && !email) throw new customError("Either email or username must be provide for login",400);

    if(!password) throw  new customError("Password credential must be provided",400);

    let user;
    if(username) user=await userSchema.findOne({username}).select('+password');
    else user=await userSchema.findOne({email}).select("+password");

    if(!user) throw new customError("Invalid credentials",400);

    const iscorrect=await user.comparePassword(password);
    if(!iscorrect) throw new customError("Wrong Password",400);

    if(!user.isVerified){
        const verToken=crypto.randomBytes(12).toString('hex');
        const verTokenExpiry= Date.now()+15*60*1000;

        if(!email) throw new customError("Unverified user must login with email",400);

        user.verificationExpiry=verTokenExpiry;
        user.verificationToken=verToken;
        await user.save();
        
        const verURL=`${req.protocol}://${req.get('host')}/api/v1/auth/verifyEmail/${verToken}?email=${email}`;
        const message=`Click on this ${verURL}  url to verify your email`

        await mailFunction(email,"Verify email",message);

        throw new customError("Go to the mail box for verification url",400);
    }

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
        message);

        res.status(200).json({
            success:true,
            message:"Reset mail sent successfully"
        })
    }catch(error){
        user.forgotPasswordToken=undefined;
        user.forgotPasswordExpiry=undefined;
        await user.save({validateBeforeSave:false})

        throw new customError("Mail sending failed", 500);
    }
})


export const resetpassword=asyncHandler(async(req,res)=>{

    console.log(req.params);

    if(req.params.forgotToken==undefined) throw new customError("Forgot token is undefined",400);
    

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