import Post from "../model/post.schema.js";
import asyncHandler from "../services/asyncHandler.js";
import { uploadOnCloudinary } from "../services/cloudinary.service.js";
import customError from "../utils/customError.js";
import fileTypes from "../utils/postFileTypes.js";
import {v2 as cloudinary} from "cloudinary";
import { postNotifications } from "./notification.controller.js";

export const makePost=asyncHandler(async(req,res)=>{
    const userId=req.user.id;
    const heading=req.body.heading;
    const content=req.body.content;

    if(!userId) throw new customError("user is missing",422);
    if(!heading) throw new customError("heading is missing",422);

    const files=req.files || [];
    let uploadedFiles=[];

    if(files.length>0){
        for(const file of files){
            const result=await uploadOnCloudinary(file.path);

            if(result && result.resource_type){
                if(!Object.values(fileTypes).includes(result.resource_type)){
                    continue;
                }

                uploadedFiles.push({
                    type:result.resource_type,
                    secure_url:result.secure_url,
                    public_id:result.public_id
                })
            }
        }
    };
        const newPost=await Post.create({
            userId,
            content,
            heading,
            file: uploadedFiles
        });

        await postNotifications({
            kind:"post",
            sender: userId,
            receiver: userId,
            post: newPost._id,
            content: `New post made with heading ${newPost.heading}`
        })

        res.status(200).json({
            success:true,
            message:"Post made successfully",
            newPost
        })
})

export const deletePost=asyncHandler(async(req,res)=>{
    const postId=req.params.postId;
    const userId=req.user._id;

    if(!postId) throw new customError("Invalid Post ID",400);
    
    const post=await Post.findById(postId);

    if(!post) throw new customError("Post Does not exist",400);

    if(post.userId.toString()!==userId.toString()) throw new customError("You are not the owner of this post, can not delete it",401);
    
    if(post.file && post.file.length>0){
        for(const file of post.file){
            await cloudinary.uploader.destroy(file.public_id,{resource_type:file.type});
        }
    }

    await Post.findByIdAndDelete(postId);

    await postNotifications({
        kind:"post",
        sender: userId,
        receiver: userId,
        post: postId,
        content: `post with postId ${postId} deleted successfully`
    })

    res.status(200).json({
        success:true,
        message:"Post deleted successfully"
    })
})

export const updatePost=asyncHandler(async(req,res)=>{
    const postId=req.params.postId;
    const userId=req.user._id;
    const content=req.body.content;
    const heading=req.body.heading;
    
    const files=req.files || [];

    if(!postId) throw new customError("Invalid post id",400);

    const post=await Post.findById(postId);

    if(!post) throw new customError("No such post exists",400);

    if(post.userId.toString()!==userId.toString()) throw new customError("You are not the owner of this post",400);

    if(!content && !heading && files.length==0) throw new customError("There is nothing to update",400);

    if(post.file && post.file.length>0){
        for(const file of post.file){
            await cloudinary.uploader.destroy(file.public_id,{resource_type:file.type});
        }
    }

    const newUploadedFiles=[];

    if(files && files.length>0){
        for(const file of files){
            const result=await uploadOnCloudinary(file.path);

            if(result && result.resource_type){
                if(!Object.values(fileTypes).includes(result.resource_type)) continue;
            }

            newUploadedFiles.push({
                type:result.resource_type,
                secure_url:result.secure_url,
                public_id:result.public_id
            })
        }
    }

    const updateData={};
    if(content) updateData.content=content;
    if(heading) updateData.heading=heading;
    if(newUploadedFiles && newUploadedFiles.length>0) updateData.file=newUploadedFiles

    const updatedPost=await Post.findByIdAndUpdate(postId,updateData,{new:true})

    await postNotifications({
        kind:"post",
        sender:userId,
        receiver:userId,
        post:postId,
        content:`post with postId ${postId} updated successfully`
    })

    res.status(200).json({
        success:true,
        message:"Post updated successfully",
        updatedPost
    })

})

export const addNewFiles=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const postId=req.params.postId;

    if(!postId) throw new customError("Invalid post id",400);

    const post=await Post.findById(postId);

    if(!post) throw new customError("No such post found",400);

    if(post.userId.toString() !== userId.toString()) throw new customError("You are not the owner of this post",400);

    
    const files=req.files||[];
    const newFiles=[]

    if(files && files.length>0){
        for(const file of files){
            const result=await uploadOnCloudinary(file.path);

            if(!Object.values(fileTypes).includes(file.resource_type)) continue;

            newFiles.push({
                type:result.resource_type,
                secure_url:result.secure_url,
                public_id:result.public_id
            })
        }
    }

    const updatedFilePost=await Post.findByIdAndUpdate(postId,{$push : { file : {$each : newFiles}}},{new:true});   // for appending new files

    await postNotifications({
        kind:"post",
        sender: userId,
        receiver: userId,
        post:postId,
        content:`New files added to post with postId ${postId}`
    })

    res.status(200).json({
        success:true,
        message:"New files added to the post",
        updatedFilePost
    })
})


export const getAllPosts=asyncHandler(async(req,res)=>{
    const userId=req.user._id;

    if(!userId) throw new customError("Invalid user id",400);

    const allPosts=await Post.find({userId}).select('heading likeCount').sort({createdAt:-1});

    res.status(200).json({
        success:true,
        message:"All post fetched with thier heading and likecount",
        allPosts
    })
})
