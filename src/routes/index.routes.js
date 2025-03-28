import { Router } from "express";
import Arouter from "./auth.routes.js";


const router=new Router();

router.use("/auth",Arouter);

export default router;