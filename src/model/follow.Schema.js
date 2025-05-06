import mongoose from "mongoose";

const followSchema=new mongoose.Schema({
    followerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    toFollowId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true})

export default mongoose.model("Follow",followSchema);