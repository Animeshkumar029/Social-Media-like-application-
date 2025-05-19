import dotenv from "dotenv";

dotenv.config();

const config={
    PORT: process.env.PORT || 8000,
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET_KEY:process.env.JWT_SECRET_KEY,
    JWT_EXPIRY:process.env.JWT_EXPIRY,
    MAILUSER: process.env.MAILUSER,
    MAILPASS: process.env.MAILPASS,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
};

export default config;