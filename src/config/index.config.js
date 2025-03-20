import dotenv from "dotenv";

dotenv.config();

const config={
    PORT: process.env.PORT || 8000,
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET_KEY:process.env.JWT_SECRET_KEY,
    JWT_EXPIRY:process.env.JWT_EXPIRY
};

export default config;