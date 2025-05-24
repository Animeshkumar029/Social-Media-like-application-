import userSchema from "../model/user.schema.js";
import asyncHandler from "../services/asyncHandler.js";
import customError from "../utils/customError.js";
import JWT from "jsonwebtoken";
import config from "../config/index.config.js";

export const isLoggedin = asyncHandler(async (req, res, next) => {
    let token;
    if (req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))) {
        token = req.cookies.token || req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        throw new customError("Authorization not granted", 400);
    }

    try {
        const decodedJWTpayload = JWT.verify(token, config.JWT_SECRET_KEY);

        const userId = decodedJWTpayload._id;
        if (!userId) {
            throw new customError("Invalid token payload", 401);
        }

        const user = await userSchema.findById(userId, "name email roles");

        if (!user) {
            throw new customError("User not found", 401);
        }

        req.user = user;
        next();
    } catch (error) {
        throw new customError("Unauthorized", 400);
    }
});

export const authorize=(...requiredRoles)=>asyncHandler(async(req,res,next)=> {
    if(!requiredRoles.includes(req.user.role)) throw new customError("You are not authorized to access this resource",400);
    next()
})
