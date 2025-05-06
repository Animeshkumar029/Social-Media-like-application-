import mongoose from "mongoose";

const postSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    heading:{
        type:String,
        required:true
    },
    content:String,
    photos:[
        {
            secure_url:{
                type:String,
                required:true
            }
        }
    ],
    likeCount: Number,
},{timestamps:true});


export default mongoose.model("Post",postSchema);