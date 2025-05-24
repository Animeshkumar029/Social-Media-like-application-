import mongoose from "mongoose";
import fileTypes from "../utils/postFileTypes.js";

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
    file:[
        {   type:{
            type:String,
            enum:Object.values(fileTypes),
            required:true
        },
            secure_url:{
                type:String,
                required:true
            },
            public_id: String
        }
    ],
    likeCount:{
        type:Number,
        default: 0
    }
},{timestamps:true});


export default mongoose.model("Post",postSchema);