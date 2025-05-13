import Notification from "../model/notifications.schema.js";
import User from "../model/user.schema.js";
import Post from "../model/post.schema.js";
import asyncHandler from "../services/asyncHandler.js";
import customError from "../utils/customError.js";
import ntype from "../utils/notificationTypes.js";

export const makeNotification=async ({kind,sender,receiver,content,post}) =>{

    if(!sender || !receiver || !kind || !content) throw new customError("Required feilds are absent",422);

    if(sender.toString()==receiver.toString()) throw new customError("sender and receiver are same",422);

    if(!Object.values(ntype).includes(kind)) throw new customError("Invalid notification type",422);

    const notice=await Notification.create({
        kind,
        content,
        sender,
        receiver,
        post
    })

    return notice;
};

export const getAllNotications=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    
    const notifications=await Notification.find({receiver:userId})
    .sort({createdAt:-1})
    .populate("sender","name");

    if(notifications.length===0) throw new customError("No notifications to show",404);

    res.status(200).json({
        success:true,
        message:"Notifications fetched successfully",
        notifications
    })

})

export const getAllNotificationsFromParticularSender=asyncHandler(async(req,res)=>{
    const {sender,receiver}=req.query;

    if(!sender || !receiver) throw new customError("Either sender or receiver is not mentioned",422);

    const notifications=await Notification.find({sender:sender , receiver:receiver})
    .sort({createdAt:-1});

    if(notifications.length===0) throw new customError("No notifications to show",404);

    res.status(200).json({
        success:true,
        message:"Notifications fetched successfully",
        notifications
    })

})

export const getAllNotificationsOnParticularPost=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const postId=req.params.postId;

    if(!postId) throw new customError("Invalid post id",422);

    const notifications=await Notification.find({receiver:userId,post:postId}).sort({createdAt:-1})

    if(notifications.length===0) throw new customError("No notifications to show",404);

    res.status(200).json({
        success:true,
        message:"Notifications fetched successfully",
        notifications
    })
})

export const markAsRead=asyncHandler(async(req,res)=>{
    const {notificationId}=req.params;

    if(!notificationId) throw new customError("Invalid id",403);

    await Notification.findByIdAndUpdate(notificationId,{isRead:true});

    res.status(200).json({
        success:true,
        message:"Notification read successfully"
    })
})