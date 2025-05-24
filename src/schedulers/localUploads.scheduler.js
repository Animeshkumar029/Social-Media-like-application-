import nodeCron from "node-cron";
import fs from "fs";
import path from "path";


const localUploadCron=nodeCron.schedule("0 0 * * *",()=>{                      // will execute the job everyday at 12 am

    const folder="./localUploads";
    if(!fs.existsSync(folder)){
        console.log(new Error("The folder does not exist"));
        return;
    } 

    fs.readdir(folder,(err,files)=>{
        if(err){
            console.log(new Error(err.message));
            return;
        }

        for(const file of files){
            try{
                fs.unlinkSync(path.join(folder,file));
                console.log(`${file} deleted successfully`);
            }catch(err){
                console.log(new Error(`Unable to delete the file -> ${file} due to ${err.message}`));
            }
        }
    })
})