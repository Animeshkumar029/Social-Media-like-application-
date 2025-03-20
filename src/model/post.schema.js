import mongoose from "mongoose";

const postSchema=new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
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
    postNumber: Number,
    createdAt:{
        time: Date,
        default:Date.now
    }
},{timestamps:true});


export default model.Schema("Post",postSchema);