import multer from "multer";
import fs from "fs";


if(!fs.existsSync("./localUploads")){
    fs.mkdirSync("./localUploads")
}


 const storage= multer.diskStorage({
    destination: "./localUploads",
    filename: (req,file,cb)=>{
        const nameOfFile=`${Date.now()}--${file.originalname}`;   // DONE TO AVOID NAME COLLISION
        cb(null,nameOfFile);
    }
})

export const localFileUpload=multer({storage});
