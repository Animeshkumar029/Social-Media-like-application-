import { Router } from "express";
import { getAllNotications,getAllNotificationsFromParticularSender,getAllNotificationsOnParticularPost, markAsRead } from "../controller/notification.controller.js";
import { isLoggedin } from "../middlewares/authMiddleware.js";

const router=Router();

router.get("/notifications/getAllNotifications",isLoggedin,getAllNotications);
router.get("/notifications/getAllNotificationsFromParticularSender/:senderId",isLoggedin,getAllNotificationsFromParticularSender);
router.get("/notifications/getAllNotificationsOnParticularPost/:postId",isLoggedin,getAllNotificationsOnParticularPost);
router.patch("/notifications/markAsRead/:notificationId",isLoggedin,markAsRead);

export default router;