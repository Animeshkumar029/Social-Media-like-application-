import rateLimit from "express-rate-limit";

export const limiterFunction=rateLimit({
    windowMs: 5*60*1000,
    limit: 25,
    handler:(req,res,next,options)=>{
        res.status(options.statusCode).json({
            success:false,
            message:"Rate per 5 minutes have exceeded"
        })
    },
    standardHeaders:true,
    legacyHeaders:false
})