import { Router } from "express";
import { login,logout,signup } from "../controller/authController.js";
import { isLoggedin } from "../middlewares/authMiddleware.js";

const router=Router();

router.post("/signup",signup);
router.post("/login",login);
router.get("/logout",logout);

router.get("/profile",isLoggedin);

export default router;