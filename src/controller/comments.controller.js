import commentsSchema from "../model/comments.schema.js";
import postSchema from "../model/post.schema.js";
import mongoose from "mongoose";
import asyncHandler from "../services/asyncHandler.js";
import customError from "../utils/customError.js";
import User from "../model/user.schema.js";
import { makeNotification } from "./notification.controller.js";
import ntype from "../utils/notificationTypes.js";

export const makeComment=asyncHandler(async(req,res)=>{
    const {postId}=req.params;
    const {commentContent}=req.body;
    const userId=req.user._id;

    if(!mongoose.Types.ObjectId.isValid(postId)){
        throw new customError("Given postId is invalid",422);
    }

    const post=await postSchema.findById(postId);

    if(!post){
        throw new customError("Post does not exist",422);
    }

    if(!commentContent) throw new customError("Please provide the content of the comment",422);

    const comment=await commentsSchema.create({
        userId,
        postId,
        content: commentContent.trim()
    })

    const senderUser=await User.findById(userId).select("name");
    const senderName=senderUser.name;
    
    await makeNotification({
        kind:ntype.COMMENT,
        sender:userId,
        receiver:post.userId,
        content:`${senderName} commented on ${post.heading}`,
        post:postId
    })

    res.status(200).json({
        success: true,
        message: "Comment made successfully",
        comment
    })
    
})

export const getCommentOnParticularPost=asyncHandler(async(req,res)=>{
    const {postId}=req.params;
    const userId=req.user._id;

    if(!mongoose.Types.ObjectId.isValid(postId)) throw new customError("given postId is not valid",422);

    const post=await postSchema.findById(postId);

    if(!post) throw new customError("Post does not exist",422);

    const comments=await commentsSchema.find({userId,postId});
    if(comments.length===0) throw new customError("No comments are made by the user on this post",422);

    res.status(200).json({
        success:true,
        message: "Comments of the user on this post are fetched successfully",
        comments
    })

})

export const getAllComments=asyncHandler(async(req,res)=>{
    const userId=req.user._id;

    const comments=await commentsSchema.find({userId}).populate('postId','heading').lean();

    if(comments.length===0) throw new customError("User has not made any comment on any post",404);

    res.status(200).json({
        success:true,
        message:"All comments made by the user fetched successfully",
        comments
    })
})

export const updateComment=asyncHandler(async(req,res)=>{
    const {commentId}=req.params;
    const {newComment}=req.body;
    const userId=req.user._id;


    if(!mongoose.Types.ObjectId.isValid(commentId)) throw new customError("The provided commentId is invalid",422);

    const comment=await commentsSchema.findById(commentId);

    if(!comment) throw new customError("Comment not found");

    if(comment.userId.toString()!=userId.toString()){
        throw new customError("You are not authorised to make this update",403);
    }

    if(!newComment) throw new customError("provide content for the comment to update",422);

    const updatedcomment=await commentsSchema.findOneAndUpdate(
        {_id: commentId},
        {content: newComment.trim()},
        {new: true, runValidators:true}
    )

    res.status(200).json({
        success:true,
        message:"Comment updated successfully",
        updatedcomment
    })

})

export const deleteComment=asyncHandler(async(req,res)=>{
    const {commentId}=req.params;
    const userId=req.user._id;

    if(!mongoose.Types.ObjectId.isValid(commentId)) throw new customError("The comment id is not valid",422);

    const comment=await commentsSchema.findById(commentId);

    if(!comment) throw new customError("No comment found",404);

    if(comment.userId.toString()!=userId.toString()){
        throw new customError("You are not authorised to delete this comment",403);
    }

    await commentsSchema.findByIdAndDelete(commentId);

    res.status(200).json({
        success:true,
        message:"Comment deleted successfully"
    })
})
