import mongoose from "mongoose";
import followSchema from "../model/follow.Schema.js";
import userSchema from "../model/user.schema.js";
import asyncHandler from "../services/asyncHandler.js";
import customError from "../utils/customError.js";

export const startFollowing=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const {toFollowId}=req.params;

    if(!toFollowId) throw new customError("Invalid id is provided",422);

    if(userId.toString()==toFollowId.toString()) throw new customError("You can't follow yourself",403);

    const alreadyFollowing=await followSchema.findOne({userId,toFollowId});

    if(alreadyFollowing) throw new customError("You already follow this account",422);

    const started=await followSchema.create({userId,toFollowId});

    await userSchema.findByIdAndUpdate(userId,{$inc: {followingCount: 1}});

    await userSchema.findByIdAndUpdate(toFollowId,{$inc:{followerCount:1}});

    res.status(200).json({
        success:true,
        message:"You started following this account",
        started
    })
})

export const unfollow=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const {toUnfollowId}=req.params;

    if(!toUnfollowId) throw new customError("You have given an invalid id",422);

    if(userId.toString()==toUnfollowId.toString()) throw new customError("You cannot unfollow yourself idiot", 422);

    const alreadyFollowing=await followSchema.findOne({userId,toUnfollowId});

    if(!alreadyFollowing) throw new customError("You can not unfollow an account which you are not following",422);

    const unfollowed=await followSchema.findOneAndDelete({userId,toUnfollowId});

    await userSchema.findByIdAndUpdate(userId,{$inc:{followingCount: -1}});
    await userSchema.findByIdAndUpdate(toUnfollowId,{$inc:{followerCount:-1}});

    res.status(200).json({
        success:true,
        message:"You unfollowed the account successfully",
        unfollowed
    })
})

export const totalFollowers=asyncHandler(async(req,res)=>{
    const userId=req.user._id;

    if(!userId) throw new customError("Invalid user ID received", 422);

    const user=await userSchema.findById(userId);

    if(!user) throw new customError("No such user found",404);

    const count=user.followerCount;

    res.status(200).json({
        success:true,
        message:"Followers count fetched successfully",
        count
    })
})

export const totalFollowing=asyncHandler(async(req,res)=>{
    const userId=req.user._id;

    if(!userId) throw new customError("Invalid user ID received", 422);

    const user=await userSchema.findById(userId);

    if(!user) throw new customError("No such user found",404);

    const count=user.followingCount;

    res.status(200).json({
        success:true,
        message:"Following count fetched successfully",
        count
    })
})

export const followersList=asyncHandler(async(req,res)=>{
    const userId=req.user._id;

    const list=await followSchema.find({toFollowId:userId}).populate('followerId','name').limit(30);

    res.status(200).json({
        success:true,
        message:"Followers list fetched successfully",
        list
    })
})

export const followingList=asyncHandler(async(req,res)=>{
    const userId=req.user._id;

    const list=await followSchema.find({followerId:userId}).populate('toFollowId','name').limit(30);

    res.status(200).json({
        success:true,
        message:"Following list fetched",
        list
    })
})