import { Router } from "express";
import { login,logout,signup,forgotPassword,resetpassword,verifyEmail } from "../controller/authController.js";


const router=Router();

router.post("/signup",signup);
router.post("/login",login);
router.get("/logout",logout);

//router.get("/profile",isLoggedin);    ----->>>> still to be written

router.patch("/password/forgotPassword",forgotPassword);
router.patch("/password/reset/:forgotToken",resetpassword);
router.get("/verifyEmail/:verToken",verifyEmail)


export default router;