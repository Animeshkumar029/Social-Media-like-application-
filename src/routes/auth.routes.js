import { Router } from "express";
import { login,logout,signup,forgotPassword,resetpassword,verifyEmail } from "../controller/authController.js";
import { isLoggedin } from "../middlewares/authMiddleware.js";

const router=Router();

router.post("/signup",signup);
router.post("/login",login);
router.get("/logout",logout);

router.get("/profile",isLoggedin);

router.patch("/password/forgotPassword",forgotPassword);
router.patch("/password/reset/:token",resetpassword);
router.get("/verifyEmail/:verToken",verifyEmail)


export default router;