import likesSchema from "../model/likes.Schema.js";
import postSchema from "../model/post.schema.js";
import asyncHandler from "../services/asyncHandler.js";
import customError from "../utils/customError.js";
import mongoose from "mongoose";
import { makeNotification } from "./notification.controller.js";
import User from "../model/user.schema.js";
import ntype from "../utils/notificationTypes.js";

export const likePost=asyncHandler(async(req,res)=>{
    const {postId}=req.params;
    const userId=req.user._id;

    if(!mongoose.Types.ObjectId.isValid(postId)) throw new customError("The postId is invalid",422);

    const post=await postSchema.findById(postId);

    if(!post) throw new customError("The post you want to like is either deleted or removed",422);

    const alreadyLiked=await likesSchema.findOne({userId,postId});

    if(alreadyLiked) throw new customError("This post is already liked by you",409);

    const like=await likesSchema.create({userId,postId});

    await postSchema.findByIdAndUpdate(postId,{$inc:{likeCount:1}});

    const senderUser=await User.findById(userId).select("name");
    const senderName=senderUser ? senderUser.name : "someone";

    await makeNotification({
        kind:"like",
        receiver:post.userId,
        sender:userId,
        content:`${senderName} liked your post ${post.heading}`,
        post:postId
    })

    res.status(200).json({
        success:true,
        message:"post liked successfully",
        like
    })
})

export const unlikePost=asyncHandler(async(req,res)=>{
    const {postId}=req.params;
    const userId=req.user._id;

    const isliked=await likesSchema.findOne({userId,postId});

    if(!isliked) throw new customError("You cannot unlike a post which you havenot liked yet",404);

    await likesSchema.findOneAndDelete({userId,postId});

    const post=await postSchema.findById(postId);

    if(post.likeCount>0) await postSchema.findByIdAndUpdate(postId,{$inc:{likeCount: -1}});

    const senderUser=await User.findById(userId).select("name");
    const senderName=senderUser?senderUser.name:"someone";

    await makeNotification({
        kind:ntype.LIKE,
        sender:userId,
        receiver:post.userId,
        content:`${senderName} unliked your post with heading ${post.heading}`,
        post:postId
    })


    res.status(200).json({
        success: true,
        message:"post unliked successfully"
    })
})

export const totalLikes=asyncHandler(async(req,res)=>{
    const {postId}=req.params;

    if(!mongoose.Types.ObjectId.isValid(postId)) throw new customError("Invalid post id",422);

    const post=await postSchema.findById(postId);

    if(!post) throw new customError("post not found",422);

    const count=post.likeCount;

    res.status(200).json({
        success:true,
        message:"Total likes count fetched",
        count
    })
})