import nodemailer from "nodemailer";
import config from "../config/index.config.js";


export const mailFunction=async(to,subject,text)=>{
    try{
        const transporter=nodemailer.createTransport({
        host:"smtp.ethereal.email",
        port:587,
        auth:{
            user:config.MAILUSER,
            pass:config.MAILPASS
        }
    })

    const send=await transporter.sendMail({
        from:`No reply <${config.MAILUSER}>`,
        to:to,
        subject:subject,
        text:text
    })

    console.log("Mail sent",send.messageId);
    console.log("Preview URL:", nodemailer.getTestMessageUrl(send)); 
    }catch(error){
        console.log("Error occured :",error.message)
        throw error;
    }
};