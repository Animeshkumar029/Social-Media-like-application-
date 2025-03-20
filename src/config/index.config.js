import dotenv from "dotenv";

dotenv.config();

const config={
    PORT: process.env.PORT || 8000,
    MONGO_URL: process.env.MONGO_URL
};

export default config;