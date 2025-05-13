import { Router } from "express";
import { getAllNotications,getAllNotificationsFromParticularSender,getAllNotificationsOnParticularPost, markAsRead } from "../controller/notification.controller.js";
import { isLoggedin } from "../middlewares/authMiddleware.js";
import router from "./likes.routes.js";

const router=Router();

router.get("/notifications/getAllNotications",isLoggedin,getAllNotications);
router.get("/notifications/getAllNotificationsFromParticularSender",isLoggedin,getAllNotificationsFromParticularSender);
router.get("/notifications/getAllNotificationsOnParticularPost",isLoggedin,getAllNotificationsOnParticularPost);
router.patch("/notifications/markAsRead",isLoggedin,markAsRead);

export default router;