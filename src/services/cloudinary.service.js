import { v2 as cloudinary } from "cloudinary";
import config from "../config/index.config.js";
import customError from "../utils/customError.js";
import fs from "fs";


cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET
})

export const uploadOnCloudinary=async(localFilePath)=>{
    try{

        if(!localFilePath) throw new customError("Empty local file path provided",400);

        const uploading=await cloudinary.uploader.upload(localFilePath,{resource_type:"auto"});

        console.log("File got uploaded to the cloudinary",uploading.url);
        return uploading;
    }catch(error){
        fs.unlinkSync(localFilePath)
        return null;
    }
}