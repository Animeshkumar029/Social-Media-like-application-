import mongoose from "mongoose";
import app from "./src/app.js";
import config from "./src/config/index.config.js";
import './src/schedulers/localUploads.scheduler.js'

(
    async()=>{
        try{
            await mongoose.connect(config.MONGO_URL);
            console.log("✅ DB CONNECTED!");

            // app.on('error',(err)=>{
            //     console.log("Error-->",err);
            //     throw err;
            // });

            const server=app.listen(config.PORT,()=>{
                console.log(`listening on port ${config.PORT}`);
            });

            server.on("error",(err)=>{
                console.log("Error-->",err);
                process.exit(1);
            })
        }
        catch(error){
            console.log("Error-->",error);
            throw error;
        }
    }
)();