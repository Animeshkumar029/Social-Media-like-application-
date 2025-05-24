import mongoose from "mongoose"; 
import ntype from "../utils/notificationTypes.js";



const notificationSchema=new mongoose.Schema({
    kind:{
        type:String,
        enum:Object.values(ntype),
        required:true
    },
    content:{
        type:String,
        required:true
    },
    sender:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiver:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    post:{
        type:mongoose.Types.ObjectId,
        ref:"Post"
    },
    isRead:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

export default mongoose.model("Notification",notificationSchema);