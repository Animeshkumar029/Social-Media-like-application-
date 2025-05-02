import mongoose from "mongoose";

const postSchema=new mongoose.Schema({
    userid:{
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
    postNumber: Number,
    createdAt:{
        type: Date,
        default:Date.now
    }
},{timestamps:true});


export default model.Schema("Post",postSchema);