import cookieParser from "cookie-parser";
import express from "express";

const app= express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(cookieParser());



export default app;
